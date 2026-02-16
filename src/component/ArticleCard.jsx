import { Link } from "react-router";
function ArticleCard({ item, formatPlainTitle }) {
  return (
    <div className="col-md-4 mb-3 d-flex">
      <Link
        to={`/articles/${item.id}`}
        className="d-block w-100 text-decoration-none d-flex flex-column"
      >
        <div className="card d-flex flex-column  h-100 border-0 radius-top-right  hover-up-small overflow-hidden p-4">
          <img
            src={item.image}
            className="card-img-top card-img radius-top-right "
            alt={formatPlainTitle(item.title)}
          />

          <div className="card-content mt-4 d-flex flex-column flex-grow-1">
            <div>
              <h5 className="fw-bold mb-2 text-truncate">
                {formatPlainTitle(item.title)}
              </h5>
            </div>
            <div className="mt-auto">
              <div className="d-flex align-items-center gap-1 flex-wrap mb-3">
                {item.tag?.map((tag) => (
                  <span
                    key={tag}
                    className="badge  bg-background-200 text-secondary-700 px-3 py-2 fw-semibold  "
                  >
                    # {tag}
                  </span>
                ))}
              </div>
              <p className="fw-semibold text-neutral-700 line-clamp-desc mb-2 ">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
export default ArticleCard;
