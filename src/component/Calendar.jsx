import axios from "axios";
import { useEffect, useState, useMemo } from "react";

import grass from "/grass.svg";
import plant from "/plant.svg";
import water from "/water.svg";

import "../assets/scss/components/_calendar.scss"


function Calendar() {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const API_PATH = import.meta.env.VITE_API_PATH;

  const [myPlants, setMyplants] = useState({});

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexTokenAPI\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );

    if (!token) return;
    axios.defaults.headers.common["Authorization"] = token;

    const getMyPlants = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/orders`);
        const result = res.data.orders.find(
          (item) => item.message === "植物狀態取用",
        );
        setMyplants(result.custom.myPlants);
      } catch (error) {
        console.error(error);
        return;
      }
    };

    getMyPlants();
  }, []);

  const groupedByDate = useMemo(() => {
    return Object.keys(myPlants).reduce((acc, id) => {
      const plant = myPlants[id];

      const dateStr = new Date(plant.lastActionAt * 1000)
        .toISOString()
        .split("T")[0];

      if (!acc[dateStr]) {
        acc[dateStr] = {
          plants: [],
          stats: { water: 0, fertilizer: 0, repot: 0 },
        };
      }

      acc[dateStr].plants.push({ id, ...plant });

      // 統計當天各項任務數
      if (plant.lastWateringTime === plant.lastActionAt)
        acc[dateStr].stats.water++;
      if (plant.lastFertilizingTime === plant.lastActionAt)
        acc[dateStr].stats.fertilizer++;
      if (plant.lastRepottingTime === plant.lastActionAt)
        acc[dateStr].stats.repot++;

      return acc;
    }, {});
  }, [myPlants]);

  const TODAY_STR = new Date().toLocaleDateString("sv-SE");

  const fullWeekDisplay = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();

    const sunday = new Date(now);
    sunday.setDate(now.getDate() - dayOfWeek);
    sunday.setHours(0, 0, 0, 0);

    const dayNames = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

    return Array.from({ length: 7 }).map((_, i) => {
      const target = new Date(sunday);
      target.setDate(sunday.getDate() + i);
      const dStr = target.toLocaleDateString("sv-SE");

      const dayData = groupedByDate[dStr];

      return {
        fullDate: dStr,
        dayName: dayNames[i],
        dateNum: target.getDate(),
        plants: dayData?.plants || [],
        stats: dayData?.stats || { water: 0, fertilizer: 0, repot: 0 },
      };
    });
  }, [groupedByDate]);

  return (
    <div className="cards-wrapper">
      {fullWeekDisplay.map((day) => {
        const isToday = day.fullDate === TODAY_STR;
        const hasTasks = day.plants.length > 0;

        return (
          <div
            key={day.fullDate}
            className={`day-card ${isToday ? "is-today" : ""} ${!hasTasks ? "is-empty" : ""}`}
          >
            <div className="card-top">
              <span className="day-name">{day.dayName}</span>
              <span className="date-num">{day.dateNum}</span>
            </div>

            {hasTasks ? (
              <>
                {/* 任務區域 */}
                <ul className="task-stats">
                  <li className="task-item">
                    {day.stats.water > 0 ? (
                      <>
                        <span className="item-text">澆水</span>
                        <span className="item-num">x {day.stats.water}</span>
                      </>
                    ) : null}
                  </li>
                  <li className="task-item">
                    {day.stats.fertilizer > 0 ? (
                      <>
                        <span className="item-text">施肥</span>
                        <span className="item-num">x {day.stats.fertilizer}</span>
                      </>
                    ) : null}
                  </li>
                  <li className="task-item">
                    {day.stats.repot > 0 ? (
                      <>
                        <span className="item-text">換盆</span>
                        <span className="item-num">x {day.stats.repot}</span>
                      </>
                    ) : null}
                  </li>
                </ul>

                {/* 植物標籤區 */}
                <div className="plant-tags">
                  {(() => {
                    const allTags = [];
                    day.plants.forEach((p) => {
                      
                      if (p.lastWateringTime === p.lastActionAt) {
                        allTags.push({
                          id: `${p.id}-w`,
                          name: p.title,
                          type: "water",
                          icon: water,
                        });
                      }
                      if (p.lastFertilizingTime === p.lastActionAt) {
                        allTags.push({
                          id: `${p.id}-f`,
                          name: p.title,
                          type: "fertilizer",
                          icon: grass,
                        });
                      }
                      if (p.lastRepottingTime === p.lastActionAt) {
                        allTags.push({
                          id: `${p.id}-r`,
                          name: p.title,
                          type: "repot",
                          icon: plant,
                        });
                      }
                    });

                    // 渲染前2個標籤
                    const visibleTags = allTags.slice(0, 2);
                    const moreCount = allTags.length - 2;

                    return (
                      <>
                        {visibleTags.map((tag) => (
                          <div key={tag.id} className={`tag ${tag.type}`}>
                            <img
                              src={tag.icon}
                              alt={tag.type}
                              className="tag-icon"
                            />
                            <span className="tag-name">{tag.name}</span>
                          </div>
                        ))}

                        {moreCount > 0 && (
                          <div className="more-link">+{moreCount} 更多</div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </>
            ) : (
              <div className="empty-content">沒有任務</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Calendar;
