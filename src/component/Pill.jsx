function Pill({ title }) {
  return (
    <>
      <span className="border border-secondary-700 rounded-pill ps-5 pe-6 py-2 fw-bold">
        <i className="bi bi-check-circle me-1"></i>
        {title}
      </span>
    </>
  );
}

export default Pill;
