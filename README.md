# 🌿 觀葉森活 Leaf & Home

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)

> 觀葉森活（Leaf & Home）是一個以「城市植栽生活」為核心概念打造的植物電商網站。
>
> 希望讓養植物不只是購買商品，而是一種能融入日常生活的療癒體驗。
>
> 使用者可透過商品瀏覽、植物照護文章、會員系統與購物流程，逐步打造屬於自己的綠意生活空間。
>
> 本專案為 **2025 六角學院 React 框架專題班團隊合作作品**，採用 React 建構前後台系統，並透過 Git Flow 進行多人協作開發。

---

## 📦 Demo

🔗 https://min82814.github.io/leafAndHome/

---

## 📸 功能展示

### 文章列表

![文章列表](./docs/article-list.gif)

### 單一文章

![單一文章](./docs/article-detail.gif)

### 後台文章管理

![後台文章管理](./docs/article-admin.gif)

---

## 👨‍💻 我的負責內容

### 旻旻（文章系統開發）

#### 前台功能

- 文章列表頁規劃設計與 RWD 切版
- 單篇文章頁規劃設計與 RWD 切版
- 文章關鍵字搜尋功能
- 文章標籤篩選功能
- 電子報串接功能
- 文章分類與內容呈現
- 文章相關 API 串接與資料處理

#### 後台功能

- 文章管理頁面規劃與切版
- 文章新增功能
- 文章編輯功能
- 文章刪除功能
- 後台文章 API 串接與資料處理

#### 共用功能

- 全站 Loading 元件
- Pagination 分頁元件

#### 團隊協作

- 共用元件程式碼整合
- Git Flow 團隊協作開發
- Pull Request 合併與版本管理

---

## 🌟 核心功能

### 前台功能

| 功能       | 說明                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| 首頁展示   | 品牌形象展示、精選商品與文章推薦                                       |
| 商品列表   | 商品瀏覽                                                               |
| 商品詳細頁 | 商品資訊展示與加入購物車                                               |
| 購物車     | 商品數量調整與優惠券套用                                               |
| 結帳流程   | 訂單建立與購買資訊填寫                                                 |
| 文章列表   | 植物照護與植栽生活文章瀏覽、文章關鍵字搜尋與標籤篩選                   |
| 單篇文章   | 完整文章閱讀體驗、電子報訂閱、推薦相關植物商品、推薦相關文章、顧客留言 |
| 會員中心   | 訂單資訊與會員資料管理                                                 |
| 我的植物   | 會員已購買植物管理與排序功能                                           |

### 後台功能

| 功能       | 說明                 |
| ---------- | -------------------- |
| 商品管理   | 商品新增、修改、刪除 |
| 訂單管理   | 訂單查詢與狀態管理   |
| 優惠券管理 | 優惠券新增與編輯     |
| 文章管理   | 文章新增、編輯與刪除 |
| 圖片管理   | 商品與文章圖片管理   |

---

## 🔧 技術棧

### 核心框架

- React 19
- Vite
- React Router DOM

### 狀態管理

- Redux Toolkit
- React Redux

### UI / 樣式

- Bootstrap 5
- Bootstrap Icons
- SCSS (SASS)

### 表單管理

- React Hook Form

### API 與資料處理

- Axios

### 其他工具

- SweetAlert2
- gh-pages

---

## 🤝 團隊分工

| 成員                                         | 共用 / 架構                                                                                    | 前台                                                                                                                                          | 後台                                                                       |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **小趴(https://github.com/papa2415)**        | ✦架構建立<br>✦API 整合<br>✦Router 設定<br>✦全域 SCSS 變數設定<br>✦Redux Toolkit 購物車狀態管理 | ✦首頁 RWD<br>✦產品列表 API 串接與資料處理                                                                                                     | ✦圖片管理 API 串接<br>✦產品 / 優惠券 / 訂單頁面切版                        |
| **PagaNiNi(https://github.com/PAgaNiNi987)** | -                                                                                              | ✦單一產品頁規劃及 RWD<br>✦單一產品 API 串接與資料處理                                                                                         | ✦產品相關頁面規劃<br>✦產品 CRUD 功能<br>✦API 串接與資料處理                |
| **Ryan(https://github.com/Ryan-1354)**       | -                                                                                              | ✦購物車頁面規劃及 RWD<br>✦購物車 API 串接與資料處理                                                                                           | ✦優惠券管理功能<br>✦優惠券 CRUD 功能<br>✦API 串接與資料處理                |
| **Min(https://github.com/MIN82814)**         | ✦全站 Loading 元件<br>✦Pagination 分頁元件                                                     | ✦文章列表頁規劃設計及 RWD<br>✦文章列表搜尋及篩選功能<br>✦單篇文章頁規劃及 RWD<br>✦電子報串接<br>✦文章相關商品推薦<br>✦文章 API 串接與資料處理 | ✦文章管理頁面規劃設計及切版<br>✦文章 CRUD 功能<br>✦文章 API 串接與資料處理 |
| **Valiela(https://github.com/Valiela)**      | -                                                                                              | ✦個人頁相關頁面規劃及 RWD<br>✦我的植物 API 串接與資料處理                                                                                     | ✦訂單相關頁面規劃<br>✦訂單 API 串接與資料處理                              |

---

## 🖥️ 本地安裝與啟動

### 環境需求

- Node.js v18 以上

### 安裝步驟

```bash
# 1. Clone 專案
git clone https://github.com/MIN82814/leafAndHome.git

# 2. 移動到專案資料夾
cd leafAndHome

# 3. 安裝套件
npm install

# 4. 啟動專案
npm run dev
```

### 本地網址

```bash
# 前台
http://localhost:5173/

# 後台
http://localhost:5173/#/admin
```

---

## 🗂️ 資料夾結構

```text
src
├─ assets
├─ components
├─ hooks
├─ layout
├─ pages
│  ├─ front
│  └─ admin
├─ services
├─ slice
├─ store
├─ utils
├─ router.jsx
├─ App.jsx
└─ main.jsx
```
