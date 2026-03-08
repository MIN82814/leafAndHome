import { useState, useEffect, useMemo, useCallback } from "react";
import { getAdminOrdersApi, updateAdminOrderApi } from "../services/order";

export const useMyPlants = () => {
  // const API_BASE = import.meta.env.VITE_API_BASE;
  // const API_PATH = import.meta.env.VITE_API_PATH;

  const [myPlants, setMyPlants] = useState({});
  const [plantProducts, setPlantProducts] = useState([]);
  const [renderBaseTime] = useState(() => Math.floor(Date.now() / 1000));

  // 植物照護
  const careStats = useMemo(() => {
    const nowUnix = renderBaseTime;

    // --- A. 計算本週日的 Unix (用於「已完成」) ---
    const sunday = new Date(nowUnix * 1000);
    sunday.setHours(0, 0, 0, 0);
    sunday.setDate(sunday.getDate() - sunday.getDay());
    const sundayUnix = Math.floor(sunday.getTime() / 1000);

    // --- B. 計算未來 7 天的 Unix (用於「待辦」) ---
    const oneWeekLaterUnix = nowUnix + 7 * 86400;

    // --- C. 設定過期很久的資料不計入 ---
    const longAgoUnix = nowUnix - 30 * 86400;

    const stats = {
      completed: { total: 0, water: 0, fertilize: 0, repot: 0 },
      pending: { total: 0, water: 0, fertilize: 0, repot: 0 },
    };

    if (!myPlants) return stats;

    Object.values(myPlants).forEach((plant) => {
      const tasks = [
        {
          type: "water",
          last: plant.lastWateringTime,
          cycle: plant.waterCycle,
        },
        {
          type: "fertilize",
          last: plant.lastFertilizingTime,
          cycle: plant.fertilizerCycle,
        },
        {
          type: "repot",
          last: plant.lastRepottingTime,
          cycle: plant.repotCycle || 365,
        },
      ];

      tasks.forEach((t) => {
        const lastAction = Number(t.last) || 0;
        const cycleDays = Number(t.cycle) || 0;
        const deadline = lastAction + cycleDays * 86400;

        // --- 規則 1 & 2：已完成 (本週日之後做的才算) ---
        if (lastAction >= sundayUnix) {
          stats.completed[t.type]++;
          stats.completed.total++;
        }

        // --- 規則 1 & 3：待辦 (現在已過期 或 未來 7 天內到期) ---
        else if (
          cycleDays > 0 &&
          deadline <= oneWeekLaterUnix &&
          lastAction > longAgoUnix
        ) {
          stats.pending[t.type]++;
          stats.pending.total++;
        }
      });
    });

    return stats;
  }, [myPlants, renderBaseTime]);

  // 我的植物狀態概覽
  const statusSummary = useMemo(() => {
    const nowUnix = renderBaseTime;
    const summary = {
      total: 0,
      healthy: 0,
      warning: 0,
      danger: 0,
      dangerList: [],
      warningList: [],
    };

    const plantList = Object.values(myPlants || {});
    summary.total = plantList.length;

    if (summary.total === 0) return summary;

    plantList.forEach((p) => {
      const getScore = (last, cycle) => {
        if (!cycle || !last) return 100;
        const elapsedSec = nowUnix - last;
        const totalCycleSec = cycle * 86400;
        if (elapsedSec >= totalCycleSec) return 0;

        return 100 - (elapsedSec / totalCycleSec) * 100;
      };

      const finalScore = Math.min(
        getScore(p.lastWateringTime, p.waterCycle),
        getScore(p.lastFertilizingTime, p.fertilizerCycle),
      );

      if (finalScore > 70) {
        summary.healthy++;
      } else if (finalScore > 40) {
        summary.warning++;
        summary.warningList.push(p.title || "未命名");
      } else {
        summary.danger++;
        summary.dangerList.push(p.title || "未命名");
      }
    });
    return summary;
  }, [myPlants, renderBaseTime]);

  //API取得
  const getMyPlants = useCallback(async () => {
    try {
      const res = await getAdminOrdersApi();
      const targetOrder = res.data.orders.find(
        (item) => item.message === "植物狀態取用",
      );

      if (targetOrder) {
        // 1. 取得custom
        if (targetOrder.custom?.myPlants) {
          setMyPlants(targetOrder.custom.myPlants);
        }

        // 2. 取得訂單中的商品清單
        if (targetOrder.products) {
          setPlantProducts(Object.values(targetOrder.products));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  // --- API: 更新資料 (澆水/施肥) ---
  const updatePlantCare = useCallback(
    async (plantId, type) => {
      try {
        // 1. 先抓取最新訂單內容
        const res = await getAdminOrdersApi();
        const targetOrder = res.data.orders.find(
          (item) => item.message === "植物狀態取用",
        );

        if (targetOrder && targetOrder.custom?.myPlants) {
          const nowUnix = Math.floor(Date.now() / 1000);
          const updatedMyPlants = { ...targetOrder.custom.myPlants };

          // 2. 更新unix時間
          if (updatedMyPlants[plantId]) {
            if (type === "water") {
              updatedMyPlants[plantId].lastWateringTime = nowUnix;
            } else if (type === "fertilize") {
              updatedMyPlants[plantId].lastFertilizingTime = nowUnix;
            }
            updatedMyPlants[plantId].lastActionAt = nowUnix;
          }

          // 3. 發送 PUT
          await updateAdminOrderApi(targetOrder.id, {
            ...targetOrder,
            custom: { ...targetOrder.custom, myPlants: updatedMyPlants },
          });

          await getMyPlants();
        }
      } catch (error) {
        console.error("更新失敗:", error);
      }
    },
    [getMyPlants],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        await getMyPlants();
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [getMyPlants]);

  return {
    myPlants,
    plantProducts,
    careStats,
    statusSummary,
    getMyPlants,
    updatePlantCare,
  };
};

export default useMyPlants;
