import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useOutletContext, useParams } from "react-router";
import {
  formatPlainTitle,
  getRelatedArticles,
} from "../../utils/articleHelpers";
import RelatedProducts from "../../component/RelatedProducts";
import ArticleHero from "../../component/ArticleHero";
import RelatedArticles from "../../component/RelatedArticles";
import Newsletter from "../../component/Newsletter";
import CommentSection from "../../component/CommentSection";
import ArticleContent from "../../component/ArticleContent";
import Loading from "../../component/Loading";
import { showErrorAlert } from "../../utils/alert";
import { getArticlesApi, getArticleIdApi } from "../../services/article";

function Article() {
  // 💡 如果你是用路由 (Route)，這裡會用 useParams 取得網址上的 id
  // 假設路由是 /article/:articleId
  //const { articleId } = useParams();
  // --- **狀態管理 (State)** ---
  const [article, setArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // --- 身分與登入狀態 ---
  const { isAuth, setIsAuth } = useOutletContext();
  const [currentUser] = useState({ userName: "林沐森" });
  // --- 留言輸入內容 ---
  const [comment, setComment] = useState("");
  const { id: articleId } = useParams();

  const articlesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [resDetail, resList] = await Promise.all([
        getArticleIdApi(articleId),
        getArticlesApi(),
      ]);
      setArticle(resDetail.data.article);
      setArticles(resList.data.articles);
    } catch (err) {
      showErrorAlert("文章載入失敗", err, "載入失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  }, [articleId]);
  useEffect(() => {
    const loadPageData = async () => {
      //設定狀態
      setArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" }); // 捲回頂部

      //等待資料抓取完成
      await articlesData();
      window.scrollTo({ top: 0, behavior: "smooth" }); // 捲回頂部
    };
    loadPageData(); // 執行它
  }, [articlesData]);
  // --- **資料處理邏輯** ---
  //推薦文章判斷
  const relatedArticles = useMemo(() => {
    return getRelatedArticles(article, articles);
  }, [article, articles]);
  // 把留言區塊找出來
  const commentData = useMemo(() => {
    return (
      article?.contentBlocks?.find((block) => block.type === "commentSection")
        ?.comments || []
    );
  }, [article]);

  // --- **留言送出邏輯** ---

  const handleCommentSubmit = async () => {
    // const token = document.cookie
    //   .split("; ")
    //   .find((row) => row.startsWith("hexTokenAPI="))
    //   ?.split("=")[1];
    //確定是否有內容才能送出
    if (!comment.trim()) {
      alert("請輸入留言內容喔！");
      return;
    }

    //準備新留言物件
    const newMsg = {
      userName: currentUser.userName,
      content: comment,
      create_at: Date.now() / 1000, // 產生秒級時間戳
    };
    //更新 article 狀態
    const updatedBlocks = article.contentBlocks.map((block) => {
      if (block.type === "commentSection") {
        return {
          ...block,
          //先展開comments內容才不會是整個陣列，會變一筆一筆留言物件，判斷如果沒有comments會傳一個空陣列
          comments: [newMsg, ...(block.comments || [])],
        };
      }
      //如果type不是留言區的資料，就把資料保留回去
      return block;
    });
    //整筆資料更新進去
    //先展開原本article資料，把剛剛updatedBlocks新的資料，更新進contentBlocks區塊內
    const updatedData = { ...article, contentBlocks: updatedBlocks };
    // try {
    //   await axios.put(
    //     `${API_BASE}/${API_PATH}/admin/article/${articleId}`,
    //     { data: updatedData },
    //     {
    //       headers: { Authorization: token }, // 把抓到的 token 放這裡
    //     },
    //   );
    //   setArticle(updatedData);
    //   setComment(""); // 清空留言處文字
    //   alert("留言成功！");
    // } catch (err) {
     //showErrorAlert("留言失敗", err, "留言失敗，請稍後再試");
    // }
    setArticle(updatedData);
    setComment(""); // 清空留言處文字
  };

  // ---**事件處理 (Event Handlers)** ---
  //先處理「載入中」的狀態
  if (isLoading || !article) {
    return <Loading text={"正在為您搬運植物..."} />;
  }
  return (
    <>
      {/* hero區塊 */}
      <ArticleHero article={article} />
      <ArticleContent
        description={article.description}
        blocks={article.contentBlocks}
        tags={article.tag}
      />
      {/* 產品推薦 */}
      <RelatedProducts blocks={article.contentBlocks} />
      {/* 推薦文章區 */}
      <RelatedArticles
        relatedArticles={relatedArticles}
        formatPlainTitle={formatPlainTitle}
      />

      {/* --- 留言/電子報 --- */}
      <section className="bg-background-200 bottom-section">
        {/* 電子報 */}
        <Newsletter />
        {/* 留言 */}
        <CommentSection
          comments={commentData}
          comment={comment}
          isAuth={isAuth}
          setIsAuth={setIsAuth}
          currentUser={currentUser}
          setComment={setComment}
          handleCommentSubmit={handleCommentSubmit}
        />
      </section>
    </>
  );
}

export default Article;
