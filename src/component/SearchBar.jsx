function SearchBar({ onChange, search, placeholder = "搜尋內容" }) {
  return (
    <div className="custom-search-group input-group rounded-3 position-relative">
      <span className="input-group-text border-0 bg-transparent pe-0">
        <i className="bi bi-search text-primary-700 fw-bold"></i>
      </span>
      <input
        type="text"
        className="form-control border-0 shadow-none  bg-transparent py-2 pe-5"
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      {search && (
        <button
          className="btn border-0 position-absolute end-0 top-50 translate-middle-y text-neutral-500 hover-text-primary-700"
          style={{ zIndex: 5 }}
          onClick={() => onChange("")} // 點擊清空
          type="button"
        >
          <i className="bi bi-x-circle-fill"></i>
        </button>
      )}
    </div>
  );
}
export default SearchBar;
