import { NavLink } from "react-router";
function Card_place({ image, title, content, icon, kind }) {
  return (
    <>
      <NavLink className="place" to="/products">
        <div className="card radius-top-right position-relative">
          <img src={image} alt={title} className="img" />
          <div className="position-absolute  bottom-0  text-center px-6 pb-5 pt-4 w-100 text">
            <h5 className="card-title h4 text-neutral-900 mb-2">{title}</h5>
            <p className="card-text fw-bold">{content}</p>
          </div>
          <div className="position-absolute end-0 p-3 rounded-circle icon lh-1">
            <span className="material-symbols-outlined lh-1 fs-3">{icon}</span>
          </div>
          <span className="text-primary-700 position-absolute tag px-4 py-1 rounded-3 fw-bold">{kind} 種植物</span>
        </div>
      </NavLink>
    </>
  );
}

export default Card_place;
