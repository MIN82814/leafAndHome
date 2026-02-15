import Calendar from "../../component/Calendar";
import Weather from "../../component/Weather";


function Personal() {
  const careData = {
    completed: {
      total: 7,
      list: [
        { label: "澆水", value: 4 },
        { label: "施肥", value: 2 },
        { label: "換盆", value: 1 },
      ],
    },
    pending: {
      total: 7,
      list: [
        { label: "澆水", value: 4 },
        { label: "施肥", value: 3 },
        { label: "換盆", value: 0 },
      ],
    },
  };

  const plantStats = {
    total: 7,
    statusList: [
      { label: "健康", count: 3 },
      { label: "需留意", count: 1 },
      { label: "需立即處理", count: 3 },
    ],
  };
  return (
    <>

      <div className="container-fluid">
        <div className="row min-vh-100 bg-neutral-100 pt-14">
          {/* <!-- 左側 Side Menu --> */}
          <aside className="col-12 col-md-4">
            <div className="row h-100">
              {/* 內容包裝層 */}
              <div className="col-12 col-md-6 ms-md-auto p-3">
                {/* 會員資訊 */}
                <div className="row align-items-center mb-3 text-center text-md-start">
                  <div className="col-auto mx-auto mx-md-0">
                    <div
                      className="ratio ratio-1x1 rounded-circle overflow-hidden"
                      style={{
                        width: "60px",
                        height: "60px",
                        // border: "2px solid #538369",
                      }}
                    >
                      <img
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                        src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770724963092.png"
                        alt="會員icon"
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md mt-2 mt-md-0">
                    <p className="h5 fw-bold mb-0" style={{ color: "#3E5E4D" }}>
                      林沐森
                    </p>
                    <p className="fs-6 mb-0" style={{ color: "#666666" }}>
                      會員
                    </p>
                  </div>
                </div>

                {/* 手機：收合按鈕 */}
                <button
                  className="btn btn-outline-secondary d-md-none w-100 mb-3"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#sideMenu"
                >
                  功能選單
                </button>

                {/* nav：手機收合，桌面顯示 */}
                <nav className="collapse d-md-block pt-3" id="sideMenu">
                  <ul className="nav nav-pills flex-column gap-2">
                    <li className="nav-item">
                      <a className="nav-link active" href="/dashboard">
                        個人儀表板
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link fw-bold"
                        style={{ color: "#222222" }}
                        href="/calendar"
                      >
                        我的植物
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link fw-bold"
                        style={{ color: "#222222" }}
                        href="/calendar"
                      >
                        個人訂單
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link fw-bold"
                        style={{ color: "#222222" }}
                        href="/plants"
                      >
                        個人收藏
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </aside>

          {/* <!-- 右側 Main Dashboard --> */}
          <main className="col-12 col-md-8 ">
            <div
              className="p-4 mx-auto"
              style={{ maxWidth: "966px", width: "100%" }}
            >
              {/* <!-- 內部區塊包裝層 --> */}
              <div className="row g-4">
                <div
                  className="p-4 mx-auto"
                  style={{ maxWidth: "966px", width: "100%" }}
                >
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
                          }}
                        >
                          <div
                            className="position-absolute top-50 start-0 translate-middle-y text-white w-100 px-4 px-md-5"
                            style={{ zIndex: 2, pointerEvents: "none" }}
                          >
                            <h3 className="fw-bold mb-1">林沐森</h3>
                            <h5 className="fw-bold mb-3">
                              歡迎回來，這裡是你的森活個人館
                            </h5>
                            <h6 className="d-none d-md-block fs-8">
                              從心動收藏到日常照護，你的森活都在這裡慢慢累積
                            </h6>
                          </div>

                          <div className="position-absolute top-0 end-0 text-end w-auto">
                              <Weather />
                          </div>


                          <picture>
                            <source
                              media="(max-width: 768px)"
                              srcSet="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770717485948.jpg"
                            />
                            <img
                              src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770716338914.jpg"
                              alt="banner"
                              className="w-100 h-100"
                              style={{ objectFit: "cover" }}
                            />
                          </picture>
                        </div>

                        {/* 下方任務導覽列 */}
                        <div
                          className="p-3 p-md-4"
                          style={{ backgroundColor: "#3d5a45" }}
                        >
                          <div className="row row-cols-2 row-cols-lg-4 g-3">
                            {[
                              { label: "待澆水", num: 3, icon: "bi-drop" },
                              { label: "待施肥", num: 1, icon: "bi-leaf" },
                              { label: "待換盆", num: 0, icon: "bi-flower1" },
                              {
                                label: "本週已完成",
                                num: 7,
                                icon: "bi-check-circle",
                              },
                            ].map((item, idx) => (
                              <div className="col" key={idx}>
                                <div
                                  style={{
                                    backgroundColor:
                                      "rgba(255, 255, 255, 0.15)",
                                    borderRadius: "12px",
                                    padding: "15px",
                                    color: "white",
                                    border:
                                      "1px solid rgba(255, 255, 255, 0.1)",
                                  }}
                                >
                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                    <div
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                        backgroundColor: "rgba(0,0,0,0.2)",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <i className={`bi ${item.icon}`}></i>
                                    </div>
                                    <span
                                      style={{
                                        fontSize: "2rem",
                                        fontFamily: "serif",
                                      }}
                                    >
                                      {item.num}
                                    </span>
                                  </div>
                                  <div
                                    style={{ fontSize: "0.8rem", opacity: 0.9 }}
                                  >
                                    {item.label}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>{" "}
                    </div>{" "}
                  </div>
                </div>

                {/* <!-- 行事曆區塊 --> */}
                <div className="col-12">
                  <div className="rounded-4 shadow-sm overflow-hidden border-0">
                    {/* 標題與連結 */}
                    <div className="px-4 py-3 d-flex justify-content-between align-items-center bg-secondary-100">
                      <h5 className="fw-bold mb-0 text-secondary-700">本週行事曆</h5>
                      <a
                        href="#"
                        className="small text-primary-700 fw-bold"
                      >
                        查看完整月曆 ▸
                      </a>
                    </div>

                    <Calendar />
                    
                  </div>
                </div>
                {/* 本週照護區塊 */}
                <div className="col-12 col-lg-8">
                  <div className="bg-white rounded-4 shadow-sm overflow-hidden border-0">
                    {/* 1. Header  */}
                    <div
                      className="px-4 py-3 d-flex justify-content-between align-items-center"
                      style={{ backgroundColor: "#EBE7DE" }}
                    >
                      <h5 className="fw-bold " style={{ color: "#74613E" }}>
                        本週照護
                      </h5>
                    </div>

                    {/* 2. Body  */}
                    <div className="row g-3">
                      {/* .map() */}
                      {[
                        {
                          title: "已完成",
                          data: careData.completed,
                          icon: "CheckCircle",
                        },
                        {
                          title: "待照護",
                          data: careData.pending,
                          icon: "Heart",
                        },
                      ].map((section, idx) => (
                        <div className="col-12 col-md-6" key={idx}>
                          <div className="card border-0 rounded-4 p-3 shadow-sm h-100">
                            {/* 卡片標題與總數 */}
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                              <div className="fw-bold text-secondary">
                                {section.title}
                              </div>
                              <div className="h3 fw-bold mb-0 text-success">
                                {section.data.total}
                              </div>
                            </div>

                            {/* 列表內容  */}
                            <div className="vstack gap-3">
                              {section.data.list.map((item, i) => (
                                <div
                                  key={i}
                                  className="d-flex justify-content-between align-items-center"
                                >
                                  <div className="text-muted small">
                                    {item.label}
                                  </div>
                                  <div
                                    className="fw-bold"
                                    style={{ color: "#8D7A5D" }}
                                  >
                                    {item.value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* <!-- 我的植物區塊 --> */}
                <div className="col-4">
                  <div className="bg-white rounded-4 shadow-sm overflow-hidden border-0">
                    {/* Header  */}
                    <div
                      className="px-4 py-3 d-flex justify-content-between align-items-center"
                      style={{ backgroundColor: "#EBE7DE" }}
                    >
                      <h5 className="fw-bold mb-0" style={{ color: "#5C5446" }}>
                        我的植物
                      </h5>
                      <a
                        href="#"
                        className="text-decoration-none small text-secondary"
                      >
                        ▶
                      </a>
                    </div>

                    {/* Body  */}
                    <div className="p-4">
                      <div className="row g-3">
                        <div className="col text-center py-5 text-muted border border-dashed rounded-3">
                          <div className="card border-0 rounded-4 p-3 mb-2 text-center shadow-sm">
                            <div className="d-flex justify-content-between align-items-center px-2">
                              <span className="text-muted small">總數</span>
                              <span className="display-6 fw-bold text-success">
                                {plantStats.total}
                              </span>
                            </div>
                          </div>

                          {/* 三個狀態方塊 */}
                          <div className="row g-2">
                            {plantStats.statusList.map((status, idx) => (
                              <div className="col-4" key={idx}>
                                <div className="card border-0 rounded-3 py-3 text-center shadow-sm h-100">
                                  <div className="h3 fw-bold text-success mb-1">
                                    {status.count}
                                  </div>
                                  <div
                                    className="text-muted"
                                    style={{ fontSize: "10px" }}
                                  >
                                    {status.label}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 森活解析區塊 */}
                <div className="col-12">
                  <div className="bg-white rounded-4 shadow-sm overflow-hidden border-0">
                    {/* 1. Header  */}
                    <div
                      className="px-4 py-3 d-flex justify-content-between align-items-center"
                      style={{ backgroundColor: "#EBE7DE" }}
                    >
                      <h5 className="fw-bold mb-0" style={{ color: "#5C5446" }}>
                        森活解析
                      </h5>
                    </div>

                    {/* 2. Body  */}
                    <div className="p-4">
                      <div className="row g-3">
                        <div className="col text-center py-5 text-muted border border-dashed rounded-3">
                          內容
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* other widgets 區塊模板 */}
                {/* <div className="col-12">
                  <div className="bg-white rounded-4 shadow-sm overflow-hidden border-0">
                    
                    <div
                      className="px-4 py-3 d-flex justify-content-between align-items-center"
                      style={{ backgroundColor: "#EBE7DE" }}
                    >
                      <h5 className="fw-bold mb-0" style={{ color: "#5C5446" }}>
                        other
                      </h5>
                      <a
                        href="#"
                        className="text-decoration-none small text-secondary"
                      >
                        查看更多 ▸
                      </a>
                    </div>

                    
                    <div className="p-4">
                      <div className="row g-3">
                        <div className="col text-center py-5 text-muted border border-dashed rounded-3">
                          內容
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Personal;
