function CareGuide({ icon, title, subTitle }) {
  return (
    <>
      <div className="col-md-6">
        <div className="d-flex bg-white p-8 gap-6 rounded-3 align-items-center">
          <span class="material-symbols-outlined text-secondary-500 fs-2">{icon}</span>
          <div>
            <h4 className="h4 mb-1">{title}</h4>
            <h6 className="h6 text-neutral-900">{subTitle}</h6>
          </div>
        </div>
      </div>
    </>
  );
}

export default CareGuide;
