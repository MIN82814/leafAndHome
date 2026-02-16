import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router";

const categories = [
  "全部",
  "新手友善",
  "疑難雜症",
  "澆水技巧",
  "光線需求",
  "居家搭配",
  "蟲蟲危機",
];

function Articles() {
  const [articles, setArticles] = useState([]);
  //搜尋狀態
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  //頁碼狀態，定義每頁顯示數量
  const pageSize = 6;
  const [currentPage, setCurrentPage] = useState(1);
  // --- useSearchParams 取得單一文章頁網址參數 ---
  const [searchParams] = useSearchParams();
  const tagUrl = searchParams.get("tag"); // 使用 .get() 取得參數
  // 單一文章頁，如果網址有 tag 就用網址的，沒有就用 "全部"
  const [selectedTag, setSelectedTag] = useState(tagUrl || "全部");
  const API_BASE = "https://vue3-course-api.hexschool.io/v2/api";
  const API_PATH = "leafandhome";
  //處理文字斷行邏輯，客製化移除br
  const formatPlainTitle = (text) => {
    if (!text) return "";
    return text.replace(/<br\s*\/?>/gi, " ");
  };
  const articlesData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/${API_PATH}/articles`);
      // const sortedData = [...res.data.articles].sort(
      //   (a, b) => Number(b.create_at) - Number(a.create_at),
      // );
      // console.log("排序後的首筆日期:", sortedData[0]?.create_at);
      setArticles(res.data.articles);
    } catch (err) {
      console.error("載入失敗", err);
    } finally {
      //管成功或失敗，最後一定要把 Loading 關掉，否則畫面會永遠卡在載入中
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setArticles([]);
    articlesData();
    if (tagUrl) {
      setSelectedTag(tagUrl);
    }
    window.scrollTo({ top: 0, behavior: "smooth" }); // 捲回頂部
  }, [tagUrl]);
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" }); // 捲回頂部
  }, [selectedTag]);
  const filteredArticles = articles
    .filter((item) => {
      // 如果文章的 tag 陣列包含選中的標籤
      const matchTag =
        selectedTag === "全部" || item.tag?.includes(selectedTag);
      //formatPlainTitle把標籤清掉
      //toLowerCase()把資料都轉為小寫
      const searchLower = search.toLowerCase();
      const matchSearch =
        formatPlainTitle(item.title).toLowerCase().includes(searchLower) ||
        formatPlainTitle(item.description).toLowerCase().includes(searchLower);
      return matchTag && matchSearch;
    })
    .sort((a, b) => b.create_at - a.create_at);
  //--- 計算分頁資料--- //
  //頁碼
  const totalPages = Math.ceil(filteredArticles.length / pageSize);
  //計算每頁要切出多少文章，用slice來切陣列資料
  const currentPageData = filteredArticles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  //Pagination 組件需要的資訊
  const paginationData = {
    total_pages: totalPages,
    current_page: currentPage,
    has_pre: currentPage > 1,
    has_next: currentPage < totalPages,
  };
  //--先處理「載入中」的狀態--//
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-success mb-3"></div>
          <p className="text-muted">🌿正在為您搬運植物...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <header className="articles-hero-section">
        <div className="container text-md-center px-7 px-md-0">
          <h1 className="fw-bold mb-5 custom-txt-shadow">生活日常誌</h1>
          <p className="fw-bold h5 custom-txt-shadow">
            探索​植物​的​療癒​力量，​給​新手​的​養植​指南
          </p>
          <div className="d-flex gap-2 justify-content-md-center mt-5 flex-wrap">
            {categories.map((tag) => (
              <button
                key={tag}
                className={`btn px-2  px-md-4 btn-category-min ${selectedTag === tag ? "btn-primary-700" : "btn-secondary-100 "}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="bg-background-200">
        <div className="container content-wrapper">
          {/* 1. 確保外層有一個 row */}
          <div className="row mb-8 justify-content-md-end">
            <div className="col-12 col-md-4">
              <div className="custom-search-group input-group rounded-3 ">
                <span className="input-group-text border-0 bg-transparent pe-0">
                  <i className="bi bi-search text-primary-700 fw-bold"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 shadow-none  bg-transparent py-2"
                  placeholder="綠手指小秘訣"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  onClick={() => setSearch("")}
                />
              </div>
            </div>
          </div>
          <div className="row gy-3">
            {currentPageData.map((item) => (
              <div key={item.id} className="col-md-4 mb-3 d-flex">
                <Link
                  to={`/articles/${item.id}`}
                  className="d-block w-100 text-decoration-none d-flex flex-column"
                >
                  <div className="card d-flex flex-column  h-100 border-0 radius-top-right  hover-up-small overflow-hidden p-4">
                    <img
                      src={item.image}
                      className="card-img-top card-img radius-top-right "
                      alt={formatPlainTitle(item.title)}
                    />

                    <div className="card-content mt-4 d-flex flex-column flex-grow-1">
                      <div>
                        <h5 className="fw-bold mb-2 text-truncate">
                          {formatPlainTitle(item.title)}
                        </h5>
                      </div>
                      <div className="mt-auto">
                        <div className="d-flex align-items-center gap-1 flex-wrap mb-3">
                          {item.tag?.map((tag) => (
                            <span
                              key={tag}
                              className="badge  bg-background-200 text-secondary-700 px-3 py-2 fw-semibold  "
                            >
                              # {tag}
                            </span>
                          ))}
                        </div>
                        <p className="fw-semibold text-neutral-700 line-clamp-desc mb-2 ">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center py-5">
              <ul className="pagination gap-2">
                {/* 上一頁按鈕 */}
                <li
                  className={`page-item ${!paginationData.has_pre ? "disabled" : ""}`}
                >
                  <button
                    className="btn btn-outline-primary-700 page-square"
                    onClick={() => {
                      setCurrentPage(currentPage - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={!paginationData.has_pre}
                  >
                    &laquo;
                  </button>
                </li>

                {/* 頁碼數字按鈕 */}
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className="page-item">
                    <button
                      className={`btn page-square  ${currentPage === i + 1 ? "btn-primary-700" : "btn-outline-primary-700"}`}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                {/* 下一頁按鈕 */}
                <li
                  className={`page-item ${!paginationData.has_next ? "disabled" : ""}`}
                >
                  <button
                    className="btn btn-outline-primary-700 page-square"
                    onClick={() => {
                      setCurrentPage(currentPage + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={!paginationData.has_next}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          )}
          {/*標籤沒有文章提醒*/}
          {filteredArticles.length === 0 && !isLoading && (
            <div className="text-center py-5">
              <div className="mb-2" style={{ fontSize: "2.5rem" }}>
                🌱
              </div>
              <h4 className="mb-3 fw-blod">這裡的小苗還在努力發芽中...</h4>
              <p className="mb-5">
                目前沒有
                <span className="fw-bold text-primary-700 ">
                  {/*判斷是沒有搜尋關鍵字，還是沒有tag*/}
                  {search ? `「${search}」` : `「${selectedTag}」`}
                </span>
                相關文章
                <br />
                {search
                  ? "園丁們正努力翻土播種，準備更多植物知識！請先試試其他關鍵字吧!"
                  : "園丁們正努力翻土播種，準備更多植物知識！請先試試其他標籤吧!"}
              </p>
              <button
                className="btn btn-primary-700"
                onClick={() => {
                  setSearch("");
                  setSelectedTag("全部");
                }}
              >
                回全部文章
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Articles;
