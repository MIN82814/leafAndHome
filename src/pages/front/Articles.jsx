import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import ArticleCard from "../../component/ArticleCard";
import Loading from "../../component/Loading";
import { formatPlainTitle } from "../../utils/articleHelpers";
import SearchBar from "../../component/SearchBar";
import NoResults from "../../component/NoResults";
import ArticlesHero from "../../component/ArticlesHero";
import { showErrorAlert } from "../../utils/alert";
import { getArticlesApi } from "../../services/article";

const categories = ["全部", "新手友善", "疑難雜症", "澆水技巧", "光線需求", "居家搭配", "蟲蟲危機"];
//文章列表頁頁碼
function Pagination({ totalPages, currentPage, setCurrentPage }) {
  if (totalPages <= 1) return null;
  const hasPre = currentPage > 1;
  const hasNext = currentPage < totalPages;
  return (
    <>
      <nav className="d-flex justify-content-center py-5">
        <ul className="pagination gap-2">
          {/* 上一頁按鈕 */}
          <li className={`page-item ${!hasPre ? "disabled" : ""}`}>
            <button
              type="button"
              className="btn btn-outline-primary-700 page-square"
              onClick={() => {
                setCurrentPage(currentPage - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={!hasPre}>
              &laquo;
            </button>
          </li>

          {/* 頁碼數字按鈕 */}
          {[...Array(totalPages)].map((_, i) => (
            <li key={i + 1} className="page-item">
              <button
                type="button"
                className={`btn page-square  ${currentPage === i + 1 ? "btn-primary-700" : "btn-outline-primary-700"}`}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}>
                {i + 1}
              </button>
            </li>
          ))}

          {/* 下一頁按鈕 */}
          <li className={`page-item ${!hasNext ? "disabled" : ""}`}>
            <button
              type="button"
              className="btn btn-outline-primary-700 page-square"
              onClick={() => {
                setCurrentPage(currentPage + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={!hasNext}>
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

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

  const articlesData = async () => {
    setIsLoading(true);
    try {
      const res = await getArticlesApi();
      // const sortedData = [...res.data.articles].sort(
      //   (a, b) => Number(b.create_at) - Number(a.create_at),
      // );

      setArticles(res.data.articles);
    } catch (err) {
      showErrorAlert("文章列表載入失敗", err, "載入失敗，請稍後再試");
    } finally {
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
      const matchTag = selectedTag === "全部" || item.tag?.includes(selectedTag);
      //formatPlainTitle把標籤清掉
      //toLowerCase()把資料都轉為小寫
      // .trim() 移除前後空白，.toLowerCase() 轉小寫
      const searchLower = search.toLowerCase().trim();
      // 使用 || "" 確保即便 title 或 description 是 null 也不會報錯
      const title = formatPlainTitle(item.title || "").toLowerCase();
      const description = formatPlainTitle(item.description || "").toLowerCase();

      const matchSearch = title.includes(searchLower) || description.includes(searchLower);

      return matchTag && matchSearch;
    })
    .sort((a, b) => b.create_at - a.create_at);
  //--- 計算分頁資料--- //
  //頁碼
  const totalPages = Math.ceil(filteredArticles.length / pageSize);
  //計算每頁要切出多少文章，用slice來切陣列資料
  const currentPageData = filteredArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  //--先處理「載入中」的狀態--//
  if (isLoading) {
    return <Loading text={"正在為您搬運植物..."} />;
  }
  return (
    <>
      {" "}
      <ArticlesHero categories={categories} selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
      <section className="bg-background-200">
        <div className="container content-wrapper">
          {/*搜尋*/}
          <div className="row mb-8 justify-content-md-end">
            <div className="col-md-4">
              <SearchBar onChange={setSearch} search={search} placeholder={"綠手指小秘訣"} />
            </div>
          </div>
          <div className="row gy-3">
            {currentPageData.map((item) => (
              <ArticleCard key={item.id} item={item} formatPlainTitle={formatPlainTitle} />
            ))}
          </div>
          <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />

          {/*標籤沒有文章提醒*/}
          {filteredArticles.length === 0 && !isLoading && (
            <NoResults
              search={search}
              selectedTag={selectedTag}
              onReset={() => {
                setSearch("");
                setSelectedTag("全部");
              }}
            />
          )}
        </div>
      </section>
    </>
  );
}

export default Articles;
