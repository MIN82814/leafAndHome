import { FaceBook, Line, LinkIcon } from "./Icon";
import { Link } from "react-router";
function TagsShare({ tags, handleShare }) {
  return (
    <>
      <div className="content-limit mt-9 mt-md-10">
        <div className="px-md-9 d-flex flex-column flex-md-row justify-content-between align-items-md-center pt-7 border-top  border-success-500 ">
          <div className="mb-9 mb-md-0 d-flex">
            <span className=" text-neutral-900  me-3">標籤：</span>
            <div className="d-flex align-items-center gap-2 flex-wrap ">
              {tags?.map((tag) => (
                <Link key={tag} className="btn btn btn-outline-primary-700 fs-9 px-3 py-1 fw-bold rounded-3 border-1" to={`/articles?tag=${tag}`}>
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
          <div className="d-flex align-items-center">
            <span className=" text-neutral-900  me-3">分享</span>
            <div className="d-flex align-items-center gap-3">
              <button type="button" className="btn rounded-circle share-btn btn-secondary-500 d-flex align-items-center" onClick={() => handleShare("fb")}>
                <FaceBook className="text-white" />
              </button>
              <button type="button" className="btn rounded-circle share-btn btn-secondary-500 d-flex align-items-center" onClick={() => handleShare("line")}>
                <Line className="text-white" />
              </button>
              <button type="button" className="btn rounded-circle share-btn btn-secondary-500 d-flex align-items-center" onClick={() => handleShare("copy")}>
                <LinkIcon className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TagsShare;
