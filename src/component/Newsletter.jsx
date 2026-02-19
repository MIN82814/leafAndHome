function Newsletter() {
  return (
    <>
      <div className="container mb-11 mb-md-14">
        <div className="card mb-3 newsletter-wrapper">
          <div className="row g-0">
            <div className="col-md-6   py-8 py-md-13 px-4  px-md-8 newsletter-left radius-top-left  d-flex align-items-center">
              <div className="card-body px-5">
                <h2 className="card-title fw-bold text-white custom-txt-shadow mb-3">
                  不想錯過養護秘訣？
                </h2>
                <p className="card-text text-white custom-txt-shadow fw-bold">
                  訂閱我們的電子報，最新植物知識直接寄到你的信箱。
                </p>
              </div>
            </div>

            <div className="col-md-6 newsletter-right py-5 py-md-13 px-4  px-md-8 d-flex align-items-center bg-primary-500 ">
              <div className="card-body">
                <form
                  action="https://github.us7.list-manage.com/subscribe/post?u=8b2d1536897d187f2aff27a8e&amp;id=1cbedfdc0d&amp;f_id=007cb7e0f0"
                  method="post"
                  id="mc-embedded-subscribe-form"
                  name="mc-embedded-subscribe-form"
                  target="_blank"
                >
                  <div className="d-flex flex-column flex-md-row">
                    <input
                      type="email"
                      name="EMAIL" // Mailchimp才收得到資料
                      className="form-control  me-md-4 mb-3 mb-md-0"
                      placeholder="請輸入您的電子信箱"
                      required
                    />
                    <button
                      className="btn btn-outline-light-primary700 py-2 px-6 text-nowrap fw-bold align-self-start mx-auto mx-md-0"
                      type="submit"
                    >
                      立即訂閱
                    </button>
                  </div>
                  {/* 「防止機器人」隱藏欄位 */}
                  <div
                    style={{ position: "absolute", left: "-5000px" }}
                    aria-hidden="true"
                  >
                    <input
                      type="text"
                      name="b_8b2d1536897d187f2aff27a8e_1cbedfdc0d"
                      tabIndex="-1"
                      value=""
                      readOnly
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Newsletter;
