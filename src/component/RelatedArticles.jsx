import { Link } from "react-router";
import { LeafIcon } from "./Icon";
function RelatedArticles({ relatedArticles, formatPlainTitle }) {
  if (!relatedArticles || relatedArticles.length === 0) return null;
  return (
    <>
      <section className="bg-background-100 rec-articles-wrapper">
        <div className="container">
          <div className="content-limit">
            <div className="row">
              <div className="d-flex d-flex align-items-center mb-9">
                <LeafIcon className="me-2 text-primary-500" />
                <h4 className="fw-bold text-primary-700">
                  更多成為綠手指的小祕訣
                </h4>
              </div>
              {relatedArticles.map((item) => (
                <div key={item.id} className="col-md-4 mb-3 d-flex">
                  <Link
                    to={`/articles/${item.id}`}
                    className="d-block w-100 text-decoration-none d-flex flex-column"
                  >
                    <div className="card d-flex flex-column  h-100 border-0 radius-top-right  hover-up-small overflow-hidden p-3">
                      <img
                        src={item.image}
                        className="card-img-top card-img radius-top-right "
                        alt={formatPlainTitle(item.title)}
                      />

                      <div className="card-content mt-4 d-flex flex-column flex-grow-1">
                        <div>
                          <h5 className="fw-bold mb-1 text-primary-700">
                            {formatPlainTitle(item.title)}
                          </h5>
                        </div>
                        <div className="mt-auto">
                          <p className="fw-semibold text-neutral-700 line-clamp-desc mt-2 ">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default RelatedArticles;
