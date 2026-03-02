import { NavLink } from "react-router";

function Card_product({ product }) {
  return (
    <>
      <NavLink className="w-100 card-product-link" to="/products">
        <div className="card card-product radius-top-right p-2">
          <img src={product.imageUrl} className="radius-top-right mb-2" alt="" />
          <div className="card-body px-2 pb-1">
            <h6 className="card-title h6 text-neutral-900">{product.title}</h6>
            <h6 className="fs-8 fs-bold">{product.titleEn}</h6>
            <div className="d-flex justify-content-between align-items-center pt-3">
              <p>4.8</p>
              <p>NT ${product.price}</p>
            </div>
          </div>
        </div>
      </NavLink>
    </>
  );
}

export default Card_product;
