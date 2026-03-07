import ArticleRenderer from "./ArticleRenderer";
import TagsShare from "./TagsShare";
import { handleShare } from "../utils/articleHelpers";

function ArticleContent({ description, blocks, tags }) {
  return (
    <>
      {/*前言區 */}
      <section className="bg-background-100">
        <div className="container py-11 pt-md-14 pb-md-15">
          <div className="content-limit">
            <p className=" text-dark opacity-75 fs-7  mb-8 mb-md-12 pb-4 pb-md-8  border-bottom text-center  italic">
              「 {description} 」
            </p>
          </div>
          {/*文章內容區*/}
          <ArticleRenderer blocks={blocks} />
          {/* 分享與標籤區 */}
          <TagsShare tags={tags} handleShare={handleShare} />
        </div>
      </section>
    </>
  );
}
export default ArticleContent;
