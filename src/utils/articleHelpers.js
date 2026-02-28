//大頭照判斷邏輯
export const AVATARS = [
  "https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1772248035796.png",
  "https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1772248110679.png",
  "https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1772247976514.png",
  "https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1772248086350.png",
];
// 根據名字計算固定頭像索引的工具
export const getFixedIndex = (str, length) => {
  if (!str) return 0;
  const charCodeSum = str
    .split("")
    .reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);
  return charCodeSum % length;
};

//處理文字斷行邏輯，客製化移除br
export const formatPlainTitle = (text) => {
  if (!text) return "";
  return text.replace(/<br\s*\/?>/gi, " ");
};

//分享功能
export const handleShare = (type) => {
  //當前瀏覽器完整網址
  const url = window.location.href;
  if (type === "fb") {
    //用來開啟新視窗或新分頁的方法，encodeURIComponent()是網址編碼
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
    );
  } else if (type === "line") {
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        url,
      )}`,
      "_blank",
    );
  } else if (type === "copy") {
    //網頁有權限存取系統的複製.貼上功能，將網址變成字串寫入使用者的電腦剪貼簿中
    navigator.clipboard.writeText(url);
    alert("文章連結已複製！");
  }
};

export const getRelatedArticles = (currentArticle, allArticles) => {
  if (!currentArticle || !allArticles || allArticles.length === 0) return []; // 如果資料還沒回來，先回傳空陣列
  return (
    allArticles
      //排除現在看的文章
      .filter((item) => item.id !== currentArticle.id)
      //從 item.tag 裡面找出跟 article.tag 一樣的東西，並且把它重新組成一個陣列
      .map((item) => {
        const sametag =
          item.tag?.filter((tag) => currentArticle.tag?.includes(tag)) || [];
        return {
          ...item,
          //在item物件的物件裡面新增一個相同tag數量總計
          score: sametag.length,
        };
      })

      // 分數高優先，同分隨機
      .sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score;
        }
        //分數一樣時，隨機排列
        return 0.5 - Math.random();
      })
      //取前三
      .slice(0, 3)
  );
};
