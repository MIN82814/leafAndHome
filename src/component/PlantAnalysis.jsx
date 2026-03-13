import { useMemo } from "react";

import useMyPlants from "../hooks/useMyPlants";
import PlantBarChart from "./PlantBarChart";

function PlantAnalysis() {
  const { statusSummary, careStats, plantProducts } = useMyPlants();

  // 本週完成率
  const completionRate = useMemo(() => {
    const done = careStats?.completed?.total || 0;
    const total = done + (careStats?.pending?.total || 0);
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }, [careStats]);

  // 隨機選取需留意植物
  const alertPlantName = useMemo(() => {
    const { dangerList, warningList } = statusSummary;
    const targetPool = dangerList.length > 0 ? dangerList : warningList;

    if (targetPool.length === 0) return "植物狀況良好";

    const index = (dangerList.length + warningList.length) % targetPool.length;
    return targetPool[index];
  }, [statusSummary]);

  // --- recharts圖表邏輯 ---
  const chartData = useMemo(() => {
    const products = plantProducts || [];
    const total = products.length;

    const extractMaxNum = (str) => {
      const match = (str || "").match(/\d+/g);
      return match ? Math.max(...match.map(Number)) : 0;
    };

    const stats = {
      light: [
        { name: "低光/半陰", value: 0 },
        { name: "散射光", value: 0 },
        { name: "日照充足", value: 0 },
      ],
      size: [
        { name: "45cm以下", value: 0 },
        { name: "46~80cm", value: 0 },
        { name: "81cm以上", value: 0 },
      ],
      humidity: [
        { name: "中階", value: 0 },
        { name: "中高階", value: 0 },
        { name: "高階", value: 0 },
      ],
      difficulty: [
        { name: "初階", value: 0 },
        { name: "中階", value: 0 },
        { name: "高階", value: 0 },
      ],
    };

    products.forEach((p) => {
      const guide = p.product?.careGuide || {};
      // 光線
      const l = guide.light || "";
      if (l.includes("日照") || l.includes("直曬")) stats.light[2].value++;
      else if (l.includes("低光") || l.includes("半陰")) stats.light[0].value++;
      else stats.light[1].value++;

      // 尺寸
      const sMax = extractMaxNum(guide.size);
      if (sMax <= 45) stats.size[0].value++;
      else if (sMax <= 80) stats.size[1].value++;
      else stats.size[2].value++;

      // 濕氣
      const hMax = extractMaxNum(guide.humidity);
      if (hMax <= 60) stats.humidity[0].value++;
      else if (hMax <= 75) stats.humidity[1].value++;
      else stats.humidity[2].value++;

      // 難度
      const d = guide.difficulty || "";
      if (d.includes("難")) stats.difficulty[2].value++;
      else if (d.includes("中等")) stats.difficulty[1].value++;
      else stats.difficulty[0].value++;
    });

    const format = (arr) =>
      arr.map((item) => ({
        ...item,
        percent: total > 0 ? `${Math.round((item.value / total) * 100)}%` : "0%",
      }));

    return {
      light: format(stats.light),
      size: format(stats.size),
      humidity: format(stats.humidity),
      difficulty: format(stats.difficulty),
    };
  }, [plantProducts]);

  return (
    <div>
      <div>
        <div className="p-4 bg-white">
          <div className="row g-4">
            {/* 上方：本週完成率 */}
            <div className="col-md-6">
              <div className="p-4 border rounded-4 h-100 ">
                <h6 className="fw-bold text-secondary-700">本週完成率</h6>
                <div className="d-flex align-items-end justify-content-end">
                  <span className="h2 fw-bold text-primary-700">{completionRate}%</span>
                </div>
              </div>
            </div>

            {/* 上方：需留意的植物 */}
            <div className="col-md-6">
              <div className="p-4 border rounded-4 h-100 d-flex flex-column justify-content-between text-end">
                <h6 className="fw-bold text-start text-secondary-700">需關照的植物</h6>
                <div className="h4 fw-bold text-primary-700">{alertPlantName}</div>
              </div>
            </div>

            {/* 下方：我的植物類型 */}
            <div>
              <div className="p-4 border rounded-4">
                <h6 className="fw-bold text-secondary-700">我的植物類型</h6>
                <div className="row">
                  <PlantBarChart title="光線" data={chartData.light} />
                  <PlantBarChart title="尺寸" data={chartData.size} />
                  <PlantBarChart title="濕氣" data={chartData.humidity} />
                  <PlantBarChart title="栽培難度" data={chartData.difficulty} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantAnalysis;
