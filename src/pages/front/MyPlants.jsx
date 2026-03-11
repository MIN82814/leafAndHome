import { useState, useMemo } from "react";
import { useMyPlants } from "../../hooks/useMyPlants";
import Sidemenu from "../../component/Sidemenu";

const MyPlants = () => {
  const { myPlants, updatePlantCare } = useMyPlants();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [nowUnix] = useState(() => Math.floor(Date.now() / 1000));

  // --- 邏輯運算 ---
  const processedPlants = useMemo(() => {
    const getDaysLeft = (last, cycle) => {
      if (!last || !cycle) return 0;
      const deadline = Number(last) + Number(cycle) * 86400;
      const diff = Math.ceil((deadline - nowUnix) / 86400);
      return diff > 0 ? diff : 0;
    };

    const getScore = (last, cycle) => {
      if (!cycle || !last) return 100;
      const elapsed = nowUnix - last;
      const score = 100 - (elapsed / (cycle * 86400)) * 100;
      return Math.max(0, Math.floor(score));
    };

    const plantArray = Object.entries(myPlants || {}).map(([key, value]) => {
      const wScore = getScore(value.lastWateringTime, value.waterCycle);
      const fScore = getScore(value.lastFertilizingTime, value.fertilizerCycle);
      const finalScore = Math.min(wScore, fScore);

      return {
        ...value,
        id: key,
        waterDays: getDaysLeft(value.lastWateringTime, value.waterCycle),
        fertDays: getDaysLeft(value.lastFertilizingTime, value.fertilizerCycle),
        waterScore: wScore,
        fertScore: fScore,
        finalScore: finalScore,
        statusLabel: finalScore > 70 ? "良好" : finalScore > 40 ? "需留意" : "急需補充",
        displayDate: new Date(value.purchaseTime * 1000).toLocaleDateString("zh-TW"),
        daysSincePurchase: Math.floor((nowUnix - value.purchaseTime) / 86400),
      };
    });

    if (!sortConfig.key) return plantArray;
    // 進行排序
    if (!sortConfig.key) return plantArray;

    return [...plantArray].sort((a, b) => {
      if (sortConfig.key === "status") {
        return sortConfig.direction === "asc" ? a.finalScore - b.finalScore : b.finalScore - a.finalScore;
      }
      if (sortConfig.key === "title") {
        return sortConfig.direction === "asc" ? (a.title || "").localeCompare(b.title || "", "zh-Hant") : (b.title || "").localeCompare(a.title || "", "zh-Hant");
      }
      const valA = a[sortConfig.key] || 0;
      const valB = b[sortConfig.key] || 0;
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    });
  }, [myPlants, sortConfig, nowUnix]);

  // --- 三段式排序 ---
  const handleSort = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") setSortConfig({ key, direction: "desc" });
      else setSortConfig({ key: null, direction: "asc" });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  return (
    <div className="container-fluid bg-neutral-100">
      <div className="row min-vh-100 pt-14 justify-content-center">
        <aside className="sidemenu-container col-12 col-md-3 col-lg-4">
          <Sidemenu />
        </aside>
        <main className="col-12 col-md-9 col-lg-8 mb-10">
          <div className="p-4" style={{ maxWidth: "966px", width: "100%" }}>
            <div className="row g-4">
              <div className="col-12">
                <div className="d-flex align-items-center bg-secondary-100 p-2 px-4" style={{ borderRadius: "4px" }}>
                  <span className="me-4 small text-secondary-500 fw-bold">排序</span>
                  <div className="d-flex flex-grow-1 justify-content-between">
                    {[
                      { label: "名稱", key: "title" },
                      { label: "狀態", key: "status" },
                      { label: "加入時間", key: "purchaseTime" },
                    ].map((item) => (
                      <button key={item.key} className="btn btn-link p-0 text-secondary-700 fw-bold" onClick={() => handleSort(item.key)}>
                        {item.label} {sortConfig.key === item.key ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {processedPlants.map((plant) => (
                <div key={plant.id} className="col-12 col-xl-4 col-lg-6">
                  <div className="card h-100 rounded-2 p-1 ">
                    <div className="card-body p-2">
                      <div className="d-flex justify-content-between align-items-end mb-3 border-bottom border-neutral-700">
                        <h4 className="card-title text-primary-700 mb-0 fw-bold flex-grow-1 me-3 pb-1">{plant.title}</h4>
                        <span className="text-nowrap fw-bold h6 text-neutral-500">第 {plant.daysSincePurchase} 天</span>
                      </div>
                      <div className="row g-0 align-items-center">
                        <div className="col-5 text-center border-end border-light">
                          <h5 className="mb-2 text-nowrap h6">{plant.waterDays <= 0 ? "今天需澆水！" : `${plant.waterDays} 天後澆水`}</h5>
                          <h5 className="text-nowrap h6">{plant.fertDays <= 0 ? "今天需施肥！" : `${plant.fertDays} 天後施肥`}</h5>
                        </div>
                        <div className="col-7 d-flex align-items-start">
                          <div className="flex-grow-1 ps-3 ">
                            {[
                              ["別稱", plant.nickname || "未命名"],
                              ["狀態", plant.statusLabel],
                              ["水分", `${plant.waterScore}%`],
                              ["養分", `${plant.fertScore}%`],
                              ["尺寸", `${plant.size || 6}`],
                              ["地點", plant.location || "未設定"],
                              ["加入時間", plant.displayDate],
                            ].map(([label, val], i) => (
                              <div key={i} className="d-flex justify-content-between">
                                <span className="text-neutral-700">{label}</span>
                                <span className={`fw-bold text-end ${label === "狀態" && plant.finalScore < 40 ? "text-danger" : "text-neutral-900"}`}>{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-2 mt-4 px-1">
                        <button className="btn btn-outline-success rounded-pill flex-grow-1 fw-bold py-1 border-2" onClick={() => updatePlantCare(plant.id, "water")}>
                          澆 水
                        </button>
                        <button className="btn btn-outline-success rounded-pill flex-grow-1 fw-bold py-1 border-2" onClick={() => updatePlantCare(plant.id, "fertilize")}>
                          施 肥
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPlants;
