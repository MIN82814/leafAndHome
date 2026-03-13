import { NavLink } from "react-router";
import iconStar from "/icons/iconStar.svg";

function Card_hor({ product, color, order }) {
  //讀取評論數
  const reviews = product?.customerReviews || [];
  // 如果讀取到評論，則取出評價的星數
  const averageStars = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length : 0;

  return (
    <>
      <NavLink className="w-100 card-hor-link" to={`/products/${product.id}`}>
        <div className="card card-hor mb-3 p-2 bg-neutral-100 rounded-4">
          <div className="d-flex gap-3 ">
            <div className="align-self-center">
              <p className={`circle rounded-pill p-2 bg-${color}  d-flex align-items-center justify-content-center text-white`}>{order}</p>
            </div>
            <div className="align-self-center">
              <img src={product.imageUrl} className="card_hor_image rounded-3" alt={product.title} />
            </div>
            <div className="flex-grow-1">
              <div className="card-body h-100 d-flex flex-column">
                <div className="mb-auto">
                  <h5 className="card-title fs-7 fw-bold text-neutral-900">{product.title}</h5>
                  <p className="card-text fs-9 fw-medium text-secondary-700">{product.titleEn}</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <p>
                    <img src={iconStar} alt="star" style={{ width: "20px" }} />
                    <span className="ms-1 align-middle fs-8">{averageStars.toFixed(1)}</span>
                  </p>
                  <button type="button" className="btn btn-outline-primary-700 fs-9 fw-bold">
                    {product.category}
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
