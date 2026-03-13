function Pagination({ pagination, onChangePage }) {
  // pagination = 現在的頁碼 , onChangePage = 重新取得現有資料的API

  const handleClick = (e, page) => {
    e.preventDefault();
    onChangePage(page);
  };

  return (
    <>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center gap-3">
          {/* has_pre has_next 為 API 回傳值 */}
          <li className={`page-item ${!pagination.has_pre && "disabled"}`}>
            <button type="button" className="btn btn-outline-primary-700 page-square" onClick={(e) => handleClick(e, pagination.current_page - 1)} disabled={!pagination.has_pre}>
              &laquo;
            </button>
          </li>

          {Array.from({ length: pagination.total_pages }, (_, index) => (
            <li className="page-item" key={`${index}_page`}>
              <button
                type="button"
                className={`btn page-square ${pagination.current_page === index + 1 ? "btn-primary-700" : "btn-outline-primary-700"}`}
                onClick={(e) => {
                  handleClick(e, index + 1);
                }}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${!pagination.has_next && "disabled"}`}>
            <button type="button" className="btn btn-outline-primary-700 page-square" onClick={(e) => handleClick(e, pagination.current_page + 1)} disabled={!pagination.has_next}>
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Pagination;
