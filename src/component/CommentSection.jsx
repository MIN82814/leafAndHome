import Title from "./Title";
import { getFixedIndex, AVATARS } from "../utils/articleHelpers";

function CommentSection({
  comments,
  comment,
  setIsAuth,
  isAuth,
  currentUser,
  setComment,
  handleCommentSubmit,
}) {
  return (
    <>
      <div className="container content-wrapper">
        <div className="content-limit">
          <div className="text-center">
            <div className="fw-bold mb-6 mb-md-12">
              <Title title="留言與討論" className="fw-bold" />
            </div>
          </div>
          {/* --- 8. 留言輸入表單 (條件渲染) --- */}
          <div className="bg-white rounded-4">
            {comments?.map((c) => (
              <div
                key={c.create_at}
                className="border-bottom border-secondary-100 d-flex py-5 px-3 py-md-9 px-md-12"
              >
                <div className="avatar-circle rounded-circle me-3 me-md-4">
                  <img
                    src={AVATARS[getFixedIndex(c.userName, AVATARS.length)]}
                    className="avatar-img"
                    alt={c.userName}
                  />
                </div>
                <div>
                  <p className="fw-bold h4 mb-4">{c.userName}</p>
                  <p className="fw-medium text-neutral-700">{c.content}</p>
                </div>
              </div>
            ))}
            {isAuth ? (
              /* --- 已登入 --- */
              <div className="py-5 px-3 py-md-9 px-md-12">
                <div className="d-flex align-items-center mb-4 mb-md-6">
                  <div className="avatar-circle rounded-circle overflow-hidden me-3 me-md-4">
                    <img
                      src={
                        AVATARS[
                          getFixedIndex(currentUser.userName, AVATARS.length)
                        ]
                      }
                      className="avatar-img"
                      alt={currentUser.userName}
                    />
                  </div>
                  <span className="fw-bold h4">{currentUser.userName}</span>
                </div>
                <div className="text-center">
                  <div className="form-floating mb-4 mb-md-6">
                    <textarea
                      className="form-control"
                      placeholder="分享您養護經驗或提出問題…"
                      id="floatingTextarea"
                      style={{ height: "100px" }}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <label htmlFor="floatingTextarea">
                      分享您養護經驗或提出問題…
                    </label>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary-500 text-white fw-bold py-2 px-6"
                    onClick={() => handleCommentSubmit()}
                  >
                    送出留言
                  </button>
                </div>
              </div>
            ) : (
              /* --- 未登入 --- */
              <div className="guest-zone text-center py-10">
                <p className="fw-bold mb-4">想加入討論嗎？登入後即可留言</p>
                <button
                  type="button"
                  className="btn btn-outline-primary-700 px-5 fw-bold"
                  onClick={() => setIsAuth(true)}
                >
                  立即登入
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CommentSection;
