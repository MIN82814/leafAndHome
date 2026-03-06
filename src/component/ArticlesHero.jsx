function ArticlesHero({ categories, selectedTag, setSelectedTag }) {
  if (!categories) return null;
  return (
    <>
      <header className="hero-base hero-overlay  hero-articles articles-hero-blur">
        <div className="container hero-content text-md-center px-7 px-md-0">
          <h1 className="fw-bold mb-5 custom-txt-shadow">生活日常誌</h1>
          <p className="fw-bold h5 custom-txt-shadow">
            探索​植物​的​療癒​力量，​給​新手​的​養植​指南
          </p>
          <div className="d-flex gap-2 justify-content-md-center mt-5 flex-wrap">
            {categories.map((tag) => (
              <button
                key={tag}
                className={`btn px-2  px-md-4 btn-category-min ${selectedTag === tag ? "btn-primary-700" : "btn-secondary-100 "}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
export default ArticlesHero;
