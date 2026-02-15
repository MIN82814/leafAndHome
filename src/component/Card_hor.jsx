import { NavLink } from "react-router";
function Card_hor({ product, color, order }) {
  return (
    <>
      <NavLink className="w-100 card-hor-link" to="/products">
        <div className="card card-hor mb-3 p-2 bg-neutral-100">
          <div className="d-flex gap-3 ">
            <div className="align-self-center">
              <p className={`circle rounded-pill p-2 bg-${color}  d-flex align-items-center justify-content-center text-white`}>{order}</p>
            </div>
            <div className="align-self-center">
              <img src={product.image} className="card_hor_image" alt={product.title} />
            </div>
            <div className="flex-grow-1">
              <div className="card-body h-100 d-flex flex-column">
                <div className="mb-auto">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.enTitle}</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <p>{product.star}</p>
                  <button type="button" className="btn btn-outline-primary-700">
                    {product.tag}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NavLink>
    </>
  );
}

export default Card_hor;
