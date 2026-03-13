function NoResults({ search, selectedTag, onReset }) {
  return (
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
        {search ? "園丁們正努力翻土播種，準備更多植物知識！請先試試其他關鍵字吧!" : "園丁們正努力翻土播種，準備更多植物知識！請先試試其他標籤吧!"}
      </p>
      <button type="button" className="btn btn-primary-700" onClick={onReset}>
        回全部文章
      </button>
    </div>
  );
}
export default NoResults;
