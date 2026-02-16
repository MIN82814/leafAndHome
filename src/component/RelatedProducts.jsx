import { Link } from "react-router";
import { LeafIcon } from "./Icon";
function RelatedProducts({ blocks }) {
  if (!blocks) return null;
  return (
    <>
      <section className="bg-background-200 py-11 py-md-14">
        <div className="container">
          <div className="content-limit">
            {blocks.map((block, index) => {
              switch (block.type) {
                case "relatedProducts":
                  return (
                    <div key={index}>
                      {/* 相關商品區 */}
                      <div className="d-flex d-flex align-items-center mb-9">
                        <LeafIcon className="me-2 text-primary-500" />
                        <h4 className="fw-bold text-primary-700">
                          {block.title}
                        </h4>
                      </div>
                      <div className="row gy-5">
                        {block.products?.map((product) => {
                          return (
                            <div
                              key={product.productId}
                              className=" col-md-4 d-flex
                                "
                            >
                              <Link
                                to={`/products/${product.productId}`}
                                className="d-block w-100 text-decoration-none d-flex flex-column"
                              >
                                <div className="card h-100 d-flex flex-column border-0 radius-top-right  hover-up-small overflow-hidden p-3">
                                  <img
                                    src={product.img}
                                    className="card-img-top card-img radius-top-right"
                                    alt={product.name}
                                  />

                                  <div className="card-body mt-4  flex-grow-1">
                                    <p className="fw-bold ">{product.name}</p>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </section>
    </>
  );
}
export default RelatedProducts;
