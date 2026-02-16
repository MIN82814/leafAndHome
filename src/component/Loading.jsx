function Loading({ text = "載入中..." }) {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-success mb-3"></div>
          <p className="text-muted">{text}</p>
        </div>
      </div>
    </>
  );
}
export default Loading;
