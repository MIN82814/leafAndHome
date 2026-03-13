import { NavLink } from "react-router";
import iconStar from "/icons/iconStar.svg";
import { currency } from "../../utils/filter";

function Card_product({ product }) {
  //讀取評論數
  const reviews = product?.customerReviews || [];
  // 如果讀取到評論，則取出評價的星數
  const averageStars = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length : 0;

  return (
    <>
      <NavLink className="w-100 card-product-link" to={`/products/${product.id}`}>
        <div className="card card-product radius-top-right p-2">
          <img src={product.imageUrl} className="radius-top-right mb-2" alt={product.title} />
          <div className="card-body px-2 pb-1">
            <h6 className="card-title h6 text-neutral-900">{product.title}</h6>
            <h6 className="fs-9 fs-bold">{product.titleEn}</h6>
            <div className="d-flex justify-content-between align-items-center pt-3">
              <p>
                <img src={iconStar} alt="star" style={{ width: "20px" }} />
                <span className="ms-1 align-middle fs-8">
                  {averageStars.toFixed(1)} ({reviews.length})
                </span>
              </p>
              <p className="h6">NT ${currency(product.price)}</p>
            </div>
          </div>
        </div>
      </NavLink>
    </>
  );
}

export default Card_product;
