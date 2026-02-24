import { useState, useEffect, useMemo } from "react";
import axios from "axios";

export const useMyPlants = () => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const API_PATH = import.meta.env.VITE_API_PATH;

  const [myPlants, setMyPlants] = useState({});
  const [plantProducts, setPlantProducts] = useState([]);

  // 植物照護
  const careStats = useMemo(() => {
    const now = new Date();

    const sunday = new Date(now);
    sunday.setHours(0, 0, 0, 0);
    sunday.setDate(now.getDate() - now.getDay());
    const sundayUnix = Math.floor(sunday.getTime() / 1000);

    const saturdayEndUnix = sundayUnix + 7 * 86400 - 1;

    const stats = {
      completed: { total: 0, water: 0, fertilizer: 0, repot: 0 },
      pending: { total: 0, water: 0, fertilizer: 0, repot: 0 },
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
          type: "fertilizer",
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

        if (lastAction >= sundayUnix) {
          stats.completed[t.type]++;
          stats.completed.total++;
        } else if (
          cycleDays > 0 &&
          deadline >= sundayUnix &&
          deadline <= saturdayEndUnix
        ) {
          stats.pending[t.type]++;
          stats.pending.total++;
        }
      });
    });

    return stats;
  }, [myPlants]);

  // 我的植物狀態概覽
  const statusSummary = useMemo(() => {
    const nowUnix = Math.floor(Date.now() / 1000);
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

        const score = 100 - (elapsedSec / totalCycleSec) * 100;
        return score;
      };

      const waterScore = getScore(p.lastWateringTime, p.waterCycle);
      const fertilizerScore = getScore(
        p.lastFertilizingTime,
        p.fertilizerCycle,
      );
      const finalScore = Math.min(waterScore, fertilizerScore);

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
  }, [myPlants, plantProducts]);

  //API取得
  const getMyPlants = async () => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexTokenAPI\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    if (!token) return;
    axios.defaults.headers.common["Authorization"] = token;
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/orders`);
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
          const productsArray = Object.values(targetOrder.products);
          setPlantProducts(productsArray);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyPlants();
  }, []);

  return { myPlants, plantProducts, careStats, statusSummary, getMyPlants };
};

export default useMyPlants;
