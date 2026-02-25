function CareGuide({ icon, title, subTitle }) {
  return (
    <>
      <div className="col-6">
        <div className="d-flex bg-white p-8 gap-6">
          <img src={icon} alt="icon" />
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
