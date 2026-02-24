import { useMemo } from "react";

import grass from "/grass.svg";
import plant from "/plant.svg";
import water from "/water.svg";

import useMyPlants from "../hooks/useMyPlants";

function Calendar() {
  const { myPlants } = useMyPlants();

  const groupedByDate = useMemo(() => {
    if (!myPlants) return {};

    return Object.keys(myPlants).reduce((acc, id) => {
      const plant = myPlants[id];
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
        if (!t.cycle) return;
        const deadlineUnix = t.last + t.cycle * 86400;
        const dateStr = new Date(deadlineUnix * 1000)
          .toISOString()
          .split("T")[0];

        if (!acc[dateStr]) {
          acc[dateStr] = {
            plants: [],
            stats: { water: 0, fertilizer: 0, repot: 0 },
            plantIds: new Set(), 
          };
        }

        acc[dateStr].stats[t.type]++;

        if (!acc[dateStr].plantIds.has(id)) {
          acc[dateStr].plants.push({ id, ...plant });
          acc[dateStr].plantIds.add(id);
        }
      });
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
                        <span className="item-num">
                          x {day.stats.fertilizer}
                        </span>
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
                      // 輔助函式：判斷這株植物的某項任務死線是不是今天
                      const isDueToday = (last, cycle) => {
                        if (!cycle) return false;
                        return (
                          new Date((last + cycle * 86400) * 1000)
                            .toISOString()
                            .split("T")[0] === day.fullDate
                        );
                      };

                      // 同一株植物 (p)，如果兩項任務都到期，就推入兩個不同的 Tag 資料
                      if (isDueToday(p.lastWateringTime, p.waterCycle)) {
                        allTags.push({
                          id: `${p.id}-w`,
                          name: p.title,
                          type: "water",
                          icon: water,
                        });
                      }
                      if (
                        isDueToday(p.lastFertilizingTime, p.fertilizerCycle)
                      ) {
                        allTags.push({
                          id: `${p.id}-f`,
                          name: p.title,
                          type: "fertilizer",
                          icon: grass,
                        });
                      }
                      if (
                        isDueToday(p.lastRepottingTime, p.repotCycle || 365)
                      ) {
                        allTags.push({
                          id: `${p.id}-r`,
                          name: p.title,
                          type: "repot",
                          icon: plant,
                        });
                      }
                    });

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
