import { NavLink } from "react-router";
import { formatPlainTitle } from "../../utils/articleHelpers";

function Card_article({ article, size }) {
  if (size === "s") {
    return (
      <>
        <NavLink className="w-100 card-article-link" to={`/articles/${article.id}`}>
          <div className="card-article rounded-3 radius-top-right">
            <img src={article.image} className="mb-3 radius-top-right" alt="租屋小套房" />
            <div className="px-2">
              <h5 className="h5 mb-2">{formatPlainTitle(article.title)}</h5>
              <p className="text-neutral-700 text-truncate">{formatPlainTitle(article.description)}</p>
            </div>
          </div>
        </NavLink>
      </>
    );
  }
  return (
    <>
      <NavLink className="w-100 card-article-link" to={`/articles/${article.id}`}>
        <div className="card-article rounded-3 radius-top-right">
          <img src={article.image} className="radius-top-right mb-6" alt={article.title} />
          <div className="pb-4 px-4">
            <h4 className="h4 mb-2">{formatPlainTitle(article.title)}</h4>
            <h6 className="h6 mb-7 text-neutral-700">{formatPlainTitle(article.description)}</h6>
            <button type="button" className="btn btn-primary-500 text-white">
              立即閱讀 <i className="bi bi-caret-right-fill"></i>
            </button>
          </div>
        </div>
      </NavLink>
    </>
  );
}

export default Card_article;
