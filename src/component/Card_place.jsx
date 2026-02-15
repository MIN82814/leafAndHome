import { NavLink } from "react-router";
function Card_place({ image, title, content, icon, kind }) {
  return (
    <>
      <NavLink className="place" to="/products">
        <div className="card radius-top-right position-relative">
          <img src={image} alt="租屋小套房" className="img" />
          <div className="position-absolute  bottom-0  text-center px-6 pb-5 pt-4 w-100 text">
            <h5 className="card-title h4 text-neutral-900 mb-2">{title}</h5>
            <p className="card-text">{content}</p>
          </div>
          <img src={icon} alt="icon" className="position-absolute end-0 p-3 rounded-circle icon" />
          <span className="text-primary-700 position-absolute tag px-4 py-1 rounded-3">{kind} 種植物</span>
        </div>
      </NavLink>
    </>
  );
}

export default Card_place;
