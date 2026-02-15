import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useOutletContext, useParams } from "react-router";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router";
import Title from "../../component/Title";
import LeafIcon  from "../../component/LeafIcon";

function Article() {
  // 💡 如果你是用路由 (Route)，這裡會用 useParams 取得網址上的 id
  // 假設路由是 /article/:articleId
  //const { articleId } = useParams();
  // --- **狀態管理 (State)** ---
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  // --- 身分與登入狀態 ---
  const { isAuth, setIsAuth } = useOutletContext();
  const [currentUser, setCurrentUser] = useState({ userName: "林沐森" });
  // --- 留言輸入內容 ---
  const [comment, setComment] = useState("");
  const { id: articleId } = useParams();
  //大頭照判斷邏輯
  const AVATARS = [
    "https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770437920064.png",
    "https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770437961135.png",
    "https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770437893922.png",
    "https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770437938518.png",
  ];

  // 根據名字計算固定頭像索引的工具
  const getFixedIndex = (str, length) => {
    if (!str) return 0;
    const charCodeSum = str
      .split("")
      .reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);
    return charCodeSum % length;
  };
  const API_BASE = "https://vue3-course-api.hexschool.io/v2/api";
  const API_PATH = "leafandhome";
  const articlesData = async () => {
    setIsLoading(true);
    try {
      const [resDetail, resList] = await Promise.all([
        axios.get(`${API_BASE}/${API_PATH}/article/${articleId}`),
        axios.get(`${API_BASE}/${API_PATH}/articles`),
      ]);

      setArticle(resDetail.data.article);
      setArticles(resList.data.articles);
    } catch (err) {
      console.error("載入失敗", err);
    } finally {
      //管成功或失敗，最後一定要把 Loading 關掉，否則畫面會永遠卡在載入中
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const loadPageData = async () => {
      //設定狀態
      setArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });// 捲回頂部

      //等待資料抓取完成
      await articlesData();
      window.scrollTo({ top: 0, behavior: "smooth" });// 捲回頂部
    };
    loadPageData(); // 執行它
  }, [articleId]);
  // --- **資料處理邏輯** ---
  //推薦文章判斷
  const relatedArticles = useMemo(() => {
    if (!article || !articles.length) return []; // 如果資料還沒回來，先回傳空陣列
    return (
      articles
        //排除現在看的文章
        .filter((item) => item.id !== article.id)
        //從 item.tag 裡面找出跟 article.tag 一樣的東西，並且把它重新組成一個陣列
        .map((item) => {
          const sametag =
            item.tag?.filter((tag) => article.tag?.includes(tag)) || [];
          return {
            ...item,
            //在item物件的物件裡面新增一個相同tag數量總計
            score: sametag.length,
          };
        })

        // 分數高優先，同分隨機
        .sort((a, b) => {
          if (a.score !== b.score) {
            return b.score - a.score;
          }
          //分數一樣時，隨機排列
          return 0.5 - Math.random();
        })
        //取前三
        .slice(0, 3)
    );
  }, [article, articles]);

  //處理文字斷行邏輯，客製化移除br
  const formatPlainTitle = (text) => {
    if (!text) return "";
    return text.replace(/<br\s*\/?>/gi, " ");
  };
  // --- 留言送出邏輯 ---
  // 3. 留言送出：React 是單向資料流，送出留言後，你要如何「不重新抓取 API」就讓畫面上出現新留言？
  const handleCommentSubmit = async () => {
    // const token = document.cookie
    //   .split("; ")
    //   .find((row) => row.startsWith("hexTokenAPI="))
    //   ?.split("=")[1];
    //確定是否有內容才能送出
    if (!comment.trim()) {
      alert("請輸入留言內容喔！");
      return;
    }

    //準備新留言物件
    const newMsg = {
      userName: currentUser.userName,
      content: comment,
      create_at: Date.now() / 1000, // 產生秒級時間戳
    };
    //更新 article 狀態
    const updatedBlocks = article.contentBlocks.map((block) => {
      if (block.type === "commentSection") {
        return {
          ...block,
          //先展開comments內容才不會是整個陣列，會變一筆一筆留言物件，判斷如果沒有comments會傳一個空陣列
          comments: [...(block.comments || []), newMsg],
        };
      }
      //如果type不是留言區的資料，就把資料保留回去
      return block;
    });
    //整筆資料更新進去
    //先展開原本article資料，把剛剛updatedBlocks新的資料，更新進contentBlocks區塊內
    const updatedData = { ...article, contentBlocks: updatedBlocks };
    // try {
    //   await axios.put(
    //     `${API_BASE}/${API_PATH}/admin/article/${articleId}`,
    //     { data: updatedData },
    //     {
    //       headers: { Authorization: token }, // 把抓到的 token 放這裡
    //     },
    //   );
    //   setArticle(updatedData);
    //   setComment(""); // 清空留言處文字
    //   alert("留言成功！");
    // } catch (err) {
    //   console.error("儲存失敗", err);
    // }
    setArticle(updatedData);
    setComment(""); // 清空留言處文字
  };

  // ---**事件處理 (Event Handlers)** ---
  //先處理「載入中」的狀態
  if (!article) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-success mb-3"></div>
          <p className="text-muted">🌿正在為您搬運植物...</p>
        </div>
      </div>
    );
  }

  //分享功能
  const handleShare = (type) => {
    //當前瀏覽器完整網址
    const url = window.location.href;
    if (type === "fb") {
      //用來開啟新視窗或新分頁的方法，encodeURIComponent()是網址編碼
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url,
        )}`,
        "_blank",
      );
    } else if (type === "line") {
      window.open(
        `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
          url,
        )}`,
        "_blank",
      );
    } else if (type === "copy") {
      //網頁有權限存取系統的複製.貼上功能，將網址變成字串寫入使用者的電腦剪貼簿中
      navigator.clipboard.writeText(url);
      alert("文章連結已複製！");
    }
  };

  return (
    <>
      {/* hero區塊 */}
      <header className="hero-section">
        <div className="container text-md-center px-7 px-md-0">
          <h1
            className="fw-bold mb-5 custom-txt-shadow"
            dangerouslySetInnerHTML={{ __html: article?.title }}
          ></h1>
          <p className="fw-bold h5 custom-txt-shadow">
            作者:{article?.author}{" "}
            <span className="d-none d-md-inline-block mx-2">|</span>
            <span className="d-block d-md-inline-block">
              發布日期：
              {new Date(article?.create_at * 1000).toLocaleDateString()}
            </span>
          </p>
        </div>
      </header>

      {/*前言區 */}
      <section className="background-100">
        <div className="container py-11 pt-md-14 pb-md-15">
          <div className="content-limit">
            <p className="lead text-dark opacity-75 fs-7  mb-8 mb-md-12 pb-4 pb-md-8  border-bottom text-center lh-lg italic">
              「 {article?.description} 」
            </p>

            {/*文章內容區*/}
            {article.contentBlocks?.map((block, index) => {
              switch (block.type) {
                case "heading":
                  return (
                    <h3
                      key={index}
                      className="fw-bold h4 mb-6 px-md-9 article-content text-neutral-900"
                      dangerouslySetInnerHTML={{ __html: block.content }}
                    ></h3>
                  );
                case "paragraph":
                  if (block.content?.trim() === "<!--EMPTY_LINE-->") {
                    return (
                      <div
                        key={index}
                        className="article-content px-md-9"
                        style={{ height: "2em" }}
                      />
                    );
                  }
                  {
                    /*dangerouslySetInnerHTML可以把HTML標籤的字串轉為網頁標籤*/
                  }
                  return (
                    <p
                      key={index}
                      className="article-content px-md-9 text-neutral-700 fw-medium"
                      dangerouslySetInnerHTML={{ __html: block.content }}
                      style={{ whiteSpace: "pre-wrap" }}
                    />
                  );
                case "image":
                  return (
                    <figure
                      key={index}
                      className="img-fluid mb-9 mt-7  mb-md-12 text-center"
                    >
                      <img
                        src={block.imageUrl}
                        alt={block.caption}
                        className="img-fluid  rounded-custom"
                      />
                      {block.caption && (
                        <figcaption className="text-muted  mt-2 italic text-center">
                          —— {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
              }
            })}
          </div>

          {/* 分享與標籤區 */}

          <div className="content-limit mt-9 mt-md-10">
            <div className="px-md-9 d-flex flex-column flex-md-row justify-content-between align-items-md-center pt-7 border-top  border-success-500 ">
              <div className="mb-9 mb-md-0 d-flex">
                <span className=" text-neutral-900  me-3">標籤：</span>
                <div className="d-flex align-items-center gap-2 flex-wrap ">
                  {article.tag?.map((tag) => (
                    <Link
                      key={tag}
                      className="btn btn btn-outline-primary-700 fs-8 px-3 py-1 fw-bold rounded-3 border-1"
                      to={`/articles?tag=${tag}`}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span className=" text-neutral-900  me-3">分享</span>
                <div className="d-flex align-items-center gap-3">
                  <button
                    className="btn rounded-circle share-btn btn-secondary-500 d-flex align-items-center"
                    onClick={() => handleShare("fb")}
                  >
                    <i className="bi bi-facebook"></i>
                  </button>
                  <button
                    className="btn rounded-circle share-btn btn-secondary-500 d-flex align-items-center"
                    onClick={() => handleShare("line")}
                  >
                    <i className="bi bi-line"></i>
                  </button>
                  <button
                    className="btn rounded-circle share-btn btn-secondary-500 d-flex align-items-center"
                    onClick={() => handleShare("copy")}
                  >
                    <i className="bi bi-link-45deg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className=" background-200 py-11 py-md-14">
        <div className="container">
          <div className="content-limit">
            {article.contentBlocks?.map((block, index) => {
              switch (block.type) {
                case "relatedProducts":
                  return (
                    <div key={index}>
                      {/* 相關商品區 */}
                       <div className="d-flex d-flex align-items-center mb-9">
                       <LeafIcon className="me-2" />
                      <h4 className="fw-bold text-primary-700">
                        {block.title}
                      </h4></div>
                      <div className="row gy-5">
                        {block.products?.map((product) => {
                          return (
                            <div
                              key={product.productId}
                              className=" col-md-4 d-flex
                            "
                            >
                              <Link
                                to={`/products/${product.productId}`}
                                className="d-block w-100 text-decoration-none d-flex flex-column"
                              >
                                <div className="card h-100 d-flex flex-column border-0 radius-top-right  hover-up-small overflow-hidden p-3">
                                  <img
                                    src={product.img}
                                    className="card-img-top card-img radius-top-right"
                                    alt={product.name}
                                  />

                                  <div className="card-body mt-4  flex-grow-1">
                                    <p className="fw-bold ">{product.name}</p>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
              }
            })}
          </div>
        </div>
      </section>
      {/* 推薦文章區 */}
      <section className=" background-100 rec-articles-wrapper">
        <div className="container">
          <div className="content-limit">
            <div className="row">
              <div className="d-flex d-flex align-items-center mb-9">
               <LeafIcon className="me-2" />
              <h4 className="fw-bold text-primary-700">
                更多成為綠手指的小祕訣
              </h4></div>
              {relatedArticles.map((item) => (
                <div key={item.id} className="col-md-4 mb-3 d-flex">
                  <Link
                    to={`/articles/${item.id}`}
                    className="d-block w-100 text-decoration-none d-flex flex-column"
                  >
                    <div className="card d-flex flex-column  h-100 border-0 radius-top-right  hover-up-small overflow-hidden p-3">
                      <img
                        src={item.image}
                        className="card-img-top card-img radius-top-right "
                        alt={formatPlainTitle(item.title)}
                      />

                      <div className="card-content mt-4 d-flex flex-column flex-grow-1">
                        <div>
                          <h5 className="fw-bold mb-1">
                            {formatPlainTitle(item.title)}
                          </h5>
                        </div>
                        <div className="mt-auto">
                          <p className="fw-semibold text-neutral-700 line-clamp-desc mt-2 ">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* --- 留言/電子報 --- */}
      <section className=" background-200  bottom-section">
        {/* 電子報 */}
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

        {/* 留言 */}
        <div className="container content-wrapper">
          <div className="content-limit">
            <div className="text-center">
              <div className="fw-bold mb-6 mb-md-12">
                 <Title title="留言與討論" className="fw-bold"/></div>
            </div>
            {/* --- 8. 留言輸入表單 (條件渲染) --- */}
            {/*篩選出留言區塊*/}
            <div className="background-white rounded-4">
              {article.contentBlocks
                ?.find((block) => block.type === "commentSection")
                ?.comments?.map((c, index) => (
                  <div
                    key={index}
                    className="border-bottom border-secondary-100 d-flex py-5 px-3 py-md-9 px-md-12"
                  >
                    <div className="avatar-circle rounded-circle me-3 me-md-4">
                      <img
                        src={AVATARS[getFixedIndex(c.userName, AVATARS.length)]}
                        className="avatar-img"
                      />
                    </div>
                    <div>
                      <p className="fw-bold h4 mb-4">{c.userName}</p>
                      <p className="fw-medium text-neutral-700">{c.content}</p>
                    </div>
                  </div>
                ))}
              {isAuth ? (
                /* ---已登入 --- */
                <div className="py-5 px-3 py-md-9 px-md-12">
                  <div className="d-flex align-items-center mb-4  mb-md-6">
                    <div className="avatar-circle rounded-circle overflow-hidden me-3 me-md-4">
                      <img
                        src={
                          AVATARS[
                            getFixedIndex(currentUser.userName, AVATARS.length)
                          ]
                        }
                        className="avatar-img "
                      />
                    </div>
                    <span className=" fw-bold h4">{currentUser.userName}</span>
                  </div>
                  <div className="text-center">
                    <div className="form-floating mb-4 mb-md-6">
                      <textarea
                        className="form-control"
                        placeholder="分享您養護經驗或提出問題…"
                        id="floatingTextarea"
                        style={{ height: " 100px" }}
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
                <div className="guest-zone text-center py-10">
                  <p className="fw-bold mb-4">想加入討論嗎？登入後即可留言</p>
                  <button
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
      </section>
    </>
  );
}

export default Article;
