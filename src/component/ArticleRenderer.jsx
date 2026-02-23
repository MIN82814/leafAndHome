
function ArticleRenderer({ blocks }) {
  // 防錯處理：如果沒資料就不要渲染
  if (!blocks) return null;
  return (
    <>
      <div className="content-limit">
        {blocks.map((block, index) => {
          switch (block.type) {
            case "heading":
              return (
                <h3
                  key={index}
                  className="fw-bold h4 mb-6 px-md-9  text-neutral-900"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                ></h3>
              );
            case "paragraph":
              if (block.content?.trim() === "<!--EMPTY_LINE-->") {
                return (
                  <div
                    key={index}
                    className="px-md-9"
                    style={{ height: "2em" }}
                  />
                );
              }
              {
                /*dangerouslySetInnerHTML可以把HTML標籤的字串轉為網頁標籤*/
              }
              return (
                <p
                  key={index}
                  className="px-md-9 text-neutral-700 fw-medium"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                  style={{ whiteSpace: "pre-wrap" }}
                />
              );
            case "image":
              return (
                <figure
                  key={index}
                  className="img-fluid mb-9 mt-7  mb-md-12 text-center"
                >
                  <img
                    src={block.imageUrl}
                    alt={block.caption}
                    className="img-fluid  rounded-custom"
                  />
                  {block.caption && (
                    <figcaption className="text-muted  mt-2 italic text-center">
                      —— {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            default:
              return null;
          }
        })}
      </div>
    </>
  );
}

export default ArticleRenderer;
