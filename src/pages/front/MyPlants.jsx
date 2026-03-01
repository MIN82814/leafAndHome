import { useState, useMemo } from "react";
import { useMyPlants } from "../../hooks/useMyPlants";
import Sidemenu from "../../component/Sidemenu";

const MyPlants = () => {
  const { myPlants, updatePlantCare } = useMyPlants();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // --- 邏輯運算 ---
  const getDaysLeft = (last, cycle) => {
    if (!last || !cycle) return 0;
    const deadline = Number(last) + Number(cycle) * 86400;
    const diff = Math.ceil((deadline - Math.floor(Date.now() / 1000)) / 86400);
    return diff > 0 ? diff : 0;
  };

  const getScore = (last, cycle) => {
    if (!cycle || !last) return 100;
    const elapsed = Math.floor(Date.now() / 1000) - last;
    const score = 100 - (elapsed / (cycle * 86400)) * 100;
    return Math.max(0, Math.floor(score));
  };

  // --- 三段式排序 ---
  const handleSort = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc")
        setSortConfig({ key, direction: "desc" });
      else setSortConfig({ key: null, direction: "asc" });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const sortedPlants = useMemo(() => {
    const plantArray = Object.entries(myPlants || {}).map(([key, value]) => ({
      ...value,
      id: key,
    }));

    if (!sortConfig.key) return plantArray;

    return [...plantArray].sort((a, b) => {
      // 狀態排序邏輯
      if (sortConfig.key === "status") {
        const getFinalScore = (p) => {
          const sWater = getScore(p.lastWateringTime, p.waterCycle);
          const sFert = getScore(p.lastFertilizingTime, p.fertilizerCycle);
          return Math.min(sWater, sFert);
        };
        const scoreA = getFinalScore(a);
        const scoreB = getFinalScore(b);
        return sortConfig.direction === "asc"
          ? scoreA - scoreB
          : scoreB - scoreA;
      }

      if (sortConfig.key === "title") {
        return sortConfig.direction === "asc"
          ? (a.title || "").localeCompare(b.title || "", "zh-Hant")
          : (b.title || "").localeCompare(a.title || "", "zh-Hant");
      }
      const valA = a[sortConfig.key] || 0;
      const valB = b[sortConfig.key] || 0;
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    });
  }, [myPlants, sortConfig]);

  return (
    <div className="container-fluid bg-neutral-100">
      <div className="row min-vh-100 pt-14 justify-content-center">
        {/* <!-- 左側 Side Menu --> */}
        <aside className="sidemenu-container col-12 col-md-3 col-lg-4">
          <Sidemenu />
        </aside>
        {/* <!-- 右側 Main Dashboard --> */}
        <main className="col-12 col-md-9 col-lg-8 mb-10">
          <div className="p-4" style={{ maxWidth: "966px", width: "100%" }}>
            <div className="row g-4">
              {/* --- 頂部排序欄 --- */}
              <div className="col-12">
                <div
                  className="d-flex align-items-center bg-secondary-100 p-2 px-4 "
                  style={{ borderRadius: "4px"}}
                >
                  <span className="me-4 small text-secondary-500 fw-bold">排序</span>
                  <div className="d-flex flex-grow-1 justify-content-between">
                    {[
                      { label: "名稱", key: "title" },
                      { label: "狀態", key: "status" },
                      { label: "加入時間", key: "purchaseTime" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        className={`btn btn-link  p-0 text-secondary-700 fw-bold`}
                        onClick={() => handleSort(item.key)}
                      >
                        {item.label}{" "}
                        {sortConfig.key === item.key
                          ? sortConfig.direction === "asc"
                            ? "▲"
                            : "▼"
                          : "⇅"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* --- 卡片列表 --- */}
              {sortedPlants.map((plant) => {
                const waterDays = getDaysLeft(
                  plant.lastWateringTime,
                  plant.waterCycle,
                );
                const fertDays = getDaysLeft(
                  plant.lastFertilizingTime,
                  plant.fertilizerCycle,
                );
                const waterScore = getScore(
                  plant.lastWateringTime,
                  plant.waterCycle,
                );
                const fertScore = getScore(
                  plant.lastFertilizingTime,
                  plant.fertilizerCycle,
                );

                const finalScore = Math.min(waterScore, fertScore);

                const statusLabel =
                  finalScore > 70
                    ? "良好"
                    : finalScore > 40
                      ? "需留意"
                      : "急需補充";

                return (
                  <div key={plant.id} className="col-12 col-xl-4 col-lg-6">
                    <div className="card h-100 rounded-2 p-1 ">
                      <div className="card-body p-2">
                        {/* 標題區 */}
                        <div className="d-flex justify-content-between align-items-end mb-3 border-bottom border-neutral-700">
                          <h4
                            className="card-title text-primary-700 mb-0 fw-bold flex-grow-1 me-3 pb-1"
                          >
                            {plant.title}
                          </h4>
                          <span
                            className="text-nowrap fw-bold h6 text-neutral-500"
                          >
                            第{" "}
                            {Math.floor(
                              (Date.now() / 1000 - plant.purchaseTime) / 86400,
                            )}{" "}
                            天
                          </span>
                        </div>

                        <div className="row g-0 align-items-center">
                          {/* 左側提醒 */}
                          <div className="col-5 text-center border-end border-light">
                            <h5
                              className={`mb-2 text-nowrap h6`}
                            >
                              {waterDays <= 0
                                ? "今天需澆水！"
                                : `${waterDays} 天後澆水`}
                            </h5>
                            <h5
                              className={`text-nowrap h6`}
                            >
                              {fertDays <= 0
                                ? "今天需施肥！"
                                : `${fertDays} 天後施肥`}
                            </h5>
                          </div>

                          {/* 右側表格 */}
                          <div className="col-7 d-flex align-items-start">
                            <div
                              className="flex-grow-1 ps-3 fs-8"
                            >
                              {[
                                ["別稱", plant.nickname || "未命名"],
                                ["狀態", statusLabel],
                                ["水分", `${waterScore}%`],
                                ["養分", `${fertScore}%`],
                                ["尺寸", `${plant.size || 6}`],
                                ["地點", plant.location || "未設定"],
                                [
                                  "加入時間",
                                  new Date(
                                    plant.purchaseTime * 1000,
                                  ).toLocaleDateString("zh-TW"),
                                ],
                              ].map(([label, val], i) => (
                                <div
                                  key={i}
                                  className="d-flex justify-content-between"
                                >
                                  <span className="text-neutral-700">{label}</span>
                                  <span
                                    className={`fw-bold text-end ${label === "狀態" && finalScore < 40 ? "text-danger" : "text-neutral-900"}`}
                                  >
                                    {val}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 按鈕 */}
                        <div className="d-flex gap-2 mt-4 px-1">
                          <button
                            className="btn btn-outline-success rounded-pill flex-grow-1 fw-bold py-1 border-2"
                            onClick={() => updatePlantCare(plant.id, "water")}
                          >
                            澆 水
                          </button>
                          <button
                            className="btn btn-outline-success rounded-pill flex-grow-1 fw-bold py-1 border-2"
                            onClick={() =>
                              updatePlantCare(plant.id, "fertilize")
                            }
                          >
                            施 肥
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPlants;
