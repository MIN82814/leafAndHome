import Calendar from "../../component/Calendar";
import PlantCare from "../../component/PlantCare";
import PlantOverview from "../../component/PlantOverview";
import PlantAnalysis from "../../component/PlantAnalysis";
import Weather from "../../component/Weather";
import Sidemenu from "../../component/Sidemenu";

import useMyPlants from "../../hooks/useMyPlants";

import grass from "/grass.svg";
import plant from "/plant.svg";
import water from "/water.svg";
import checkCircle from "/checkCircle.svg";

function Personal() {
  const { careStats } = useMyPlants();

  const taskItems = [
    { label: "待澆水", num: careStats.pending.water, icon: water },
    { label: "待施肥", num: careStats.pending.fertilize, icon: grass },
    { label: "待換盆", num: careStats.pending.repot, icon: plant },
    { label: "本週已完成", num: careStats.completed.total, icon: checkCircle },
  ];

  return (
    <>
      <div className="container-fluid bg-neutral-100">
        <div className="row min-vh-100 pt-14 justify-content-center">
          {/* <!-- 左側 Side Menu --> */}
          <aside className="sidemenu-container col-12 col-md-3 col-lg-4">
            <Sidemenu />
          </aside>
          {/* <!-- 右側 Main Dashboard --> */}
          <main className="col-12 col-md-9 col-lg-8 mb-10">
            <div className="p-4" style={{ maxWidth: "966px", width: "100%" }}>
              {/* <!-- 內部區塊包裝層 --> */}
              <div className="row g-4">
                <div className="p-4 mx-auto">
                  {/* <!-- 歡迎區塊 --> */}
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="d-flex flex-column shadow-sm rounded-4 overflow-hidden">
                        {/* 上方 Banner */}
                        <div
                          className="position-relative"
                          style={{
                            aspectRatio: "966 / 300",
                            minHeight: "200px",
                          }}>
                          <div className="position-absolute top-50 start-0 translate-middle-y text-white w-100 px-4 px-md-5" style={{ zIndex: 2, pointerEvents: "none" }}>
                            <h3 className="fw-bold mb-1">林沐森</h3>
                            <h5 className="fw-bold mb-3">歡迎回來，這裡是你的森活個人館</h5>
                            <h6 className="d-none d-md-block fs-9">從心動收藏到日常照護，你的森活都在這裡慢慢累積</h6>
                          </div>

                          <div className="position-absolute top-0 end-0 text-end w-auto">
                            <Weather />
                          </div>

                          <picture>
                            <source media="(max-width: 768px)" srcSet="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770717485948.jpg" />
                            <img src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770716338914.jpg" alt="banner" className="w-100 h-100" style={{ objectFit: "cover" }} />
                          </picture>
                        </div>

                        {/* 下方任務導覽列 */}
                        <div className="task-banner-container p-3 p-md-4 bg-primary-700">
                          <div className="row row-cols-2 row-cols-lg-4 g-3">
                            {taskItems.map((item, idx) => (
                              <div className="col" key={idx}>
                                <div className="task-card bg-primary-500 text-background-100">
                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                    <div className="icon-wrapper bg-primary-700">
                                      <img src={item.icon} alt={item.label} />
                                    </div>
                                    <span className="task-num h2">{item.num}</span>
                                  </div>
                                  <div className="task-label h6">{item.label}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- 行事曆區塊 --> */}
                <div className="col-12">
                  <div className="rounded-4 overflow-hidden border-0">
                    {/* Header */}
                    <div className="px-4 py-3 d-flex justify-content-between align-items-center bg-secondary-100">
                      <h5 className="fw-bold mb-0 text-secondary-700">本週行事曆</h5>
                      <a href="#" className="small text-primary-700 fw-bold">
                        查看完整月曆 ▸
                      </a>
                    </div>
                    {/* Body */}
                    <Calendar />
                  </div>
                </div>
                {/* 本週照護區塊 */}
                <div className="col-12 col-lg-8 mb-4">
                  <div className="bg-white rounded-4 overflow-hidden  h-100 d-flex flex-column">
                    {/* Header */}
                    <div className="px-4 py-3 d-flex justify-content-between align-items-center bg-secondary-100">
                      <h5 className="fw-bold mb-0 text-secondary-700">本週照護</h5>
                    </div>

                    {/* Body */}
                    <div className="flex-grow-1">
                      <PlantCare />
                    </div>
                  </div>
                </div>

                {/* <!-- 我的植物區塊 --> */}
                <div className="col-12 col-lg-4 mb-4">
                  <div className="bg-white rounded-4 overflow-hidden h-100 d-flex flex-column">
                    {/* Header */}
                    <div className="px-4 py-3 d-flex justify-content-between align-items-center bg-secondary-100">
                      <h5 className="fw-bold mb-0 text-secondary-700">我的植物</h5>
                    </div>
                    {/* Body */}
                    <div className="flex-grow-1">
                      <PlantOverview />
                    </div>
                  </div>
                </div>

                {/* 森活解析區塊 */}
                <div className="col-12">
                  <div className="rounded-4 overflow-hidden border-0">
                    {/* 1. Header  */}
                    <div className="px-4 py-3 d-flex justify-content-between align-items-center bg-secondary-100">
                      <h5 className="fw-bold mb-0 text-secondary-700">森活解析</h5>
                    </div>

                    {/* 2. Body  */}
                    <PlantAnalysis />
                  </div>
                </div>
                <div className="col-12 mx-auto text-center m-10">
                  <a className="btn btn-primary-500 text-white" href="#" role="button">
                    查看更多解析 <span className="small">▶</span>
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Personal;
