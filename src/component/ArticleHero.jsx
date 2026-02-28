function ArticleHero({ article }) {
  if (!article) return null;
  return (
    <>
      <header className="hero-base hero-overlay  hero-article-detail">
        <div className="container hero-content text-md-center  px-7 px-md-0">
          <h2
            className="fw-bold mb-5 custom-txt-shadow"
            dangerouslySetInnerHTML={{ __html: article.title }}
          ></h2>
          <p className="fw-bold h5 custom-txt-shadow">
            作者:{article.author}{" "}
            <span className="d-none d-md-inline-block mx-2">|</span>
            <span className="d-block d-md-inline-block">
              發布日期：
              {new Date(article.create_at * 1000).toLocaleDateString()}
            </span>
          </p>
        </div>
      </header>
    </>
  );
}
export default ArticleHero;
