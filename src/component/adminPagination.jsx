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
            <a className="page-link" href="#" aria-label="Previous" onClick={(e) => handleClick(e, pagination.current_page - 1)}>
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {Array.from({ length: pagination.total_pages }, (_, index) => (
            <li className={`page-item ${pagination.current_page === index + 1 && "active"}`} key={`${index}_page`}>
              <a className="page-link" href="#" onClick={(e) => handleClick(e, index + 1)}>
                {index + 1}
              </a>
            </li>
          ))}
          <li className={`page-item ${!pagination.has_next && "disabled"}`}>
            <a className="page-link" href="#" aria-label="Next" onClick={(e) => handleClick(e, pagination.current_page + 1)}>
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Pagination;
