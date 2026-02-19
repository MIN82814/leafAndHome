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
              className="btn btn-outline-primary-700 page-square"
              onClick={() => {
                setCurrentPage(currentPage - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={!hasPre}
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
          <li className={`page-item ${!hasNext ? "disabled" : ""}`}>
            <button
              className="btn btn-outline-primary-700 page-square"
              onClick={() => {
                setCurrentPage(currentPage + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={!hasNext}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
export default Pagination;
