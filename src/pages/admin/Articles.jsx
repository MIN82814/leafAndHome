import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router"; 
import axios from "axios";

// --- 📦 套件引入 ---
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import DragDrop from "editorjs-drag-drop";

// --- 📏 自定義空白行插件 ---
class EmptyLine {
  static get toolbox() {
    return { title: "空白行", icon: "—" };
  }
  
  constructor({ data }) {
    this.data = data;
  }
  
  render() {
    const wrapper = document.createElement("div");
    wrapper.style.height = "1.2em";
    wrapper.style.borderLeft = "2px solid #e8e8e8";
    wrapper.style.paddingLeft = "8px";
    wrapper.innerHTML = '<span style="color: #ccc; font-size: 0.85em;">[ 空白行 ]</span>';
    return wrapper;
  }
  
  save() {
    return { isEmpty: true };
  }
}

// --- 📸 自定義圖片插件 (支援網址與上傳) ---
class UrlImage {
  static get toolbox() {
    return { title: "Image (URL/Upload)", icon: "📸" };
  }
  constructor({ data, config }) {
    this.data = data;
    this.wrapper = undefined;
    this.apiConfig = config.apiConfig;
  }
  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "p-3 border rounded bg-light text-center shadow-sm";

    if (this.data && this.data.url) {
      this._showImage(this.data.url, this.data.caption);
    } else {
      const container = document.createElement("div");
      const input = document.createElement("input");
      input.className = "form-control mb-2";
      input.placeholder = "貼上圖片網址並按 Enter...";
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const url = e.target.value.trim();
          if (url) this._showImage(url);
        }
      });

      const uploadBtn = document.createElement("button");
      uploadBtn.className = "btn btn-sm btn-outline-primary w-100 mb-1";
      uploadBtn.innerHTML = "📁 選擇本地檔案上傳";

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.style.display = "none";

      uploadBtn.onclick = () => fileInput.click();
      fileInput.onchange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        uploadBtn.innerText = "⏳ 上傳中...";
        try {
          const formData = new FormData();
          formData.append("file-to-upload", file);
          const res = await axios.post(
            `${this.apiConfig.API_BASE}/api/${this.apiConfig.API_PATH}/admin/upload`,
            formData
          );
          if (res.data.success) this._showImage(res.data.imageUrl);
        } catch (err) {
          alert("上傳失敗");
          uploadBtn.innerText = "📁 重新上傳";
        }
      };
      container.appendChild(input);
      container.appendChild(uploadBtn);
      container.appendChild(fileInput);
      this.wrapper.appendChild(container);
    }
    return this.wrapper;
  }
  _showImage(url, caption = "") {
    this.wrapper.innerHTML = "";
    this.wrapper.style.border = "none";
    this.wrapper.style.background = "transparent";
    const img = document.createElement("img");
    img.src = url;
    img.classList.add("img-fluid", "rounded", "mb-2");
    const capInput = document.createElement("input");
    capInput.classList.add("form-control", "form-control-sm", "text-center", "border-0");
    capInput.placeholder = "輸入圖片說明...";
    capInput.value = caption;
    this.wrapper.appendChild(img);
    this.wrapper.appendChild(capInput);
    this.data = { url, caption };
  }
  save(blockContent) {
    const captionInput = blockContent.querySelector("input");
    return {
      url: this.data.url,
      caption: captionInput ? captionInput.value : "",
    };
  }
}

// --- CMS 主程式 ---
function Articles() {
  const { token, API_BASE, API_PATH } = useOutletContext();

  const [articles, setArticles] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    create_at: "",
    author: "森活小編",
    isPublic: true,
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [comments, setComments] = useState([]); // 留言狀態
  const editorRef = useRef(null);

  const TAG_OPTIONS = ["新手友善", "澆水技巧", "光線需求", "疑難雜症", "居家搭配"];

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      fetchInitialData();
    }

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editorjs-container",
        placeholder: "在此輸入正文... (按 Shift+Enter 可在區塊內換行)",
        tools: {
          header: {
            class: Header,
            config: { levels: [3], defaultLevel: 3 },
          },
          image: { 
            class: UrlImage,
            config: { apiConfig: { API_BASE, API_PATH } }
          },
          emptyLine: EmptyLine,
        },
        data: {},
        onChange: async () => {
          // 這個 onChange 可以幫助我們在編輯過程中追蹤狀態
        },
        onReady: () => {
          new DragDrop(editor);
        },
      });
      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [token]);

  const fetchInitialData = () => {
    fetchArticles();
    fetchAllProducts();
  };

  const fetchArticles = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/articles`);
      setArticles(res.data.articles || []);
    } catch (err) {
      console.error("無法取得文章列表");
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`);
      if (res.data.success) setAllProducts(res.data.products);
    } catch (err) {
      console.error("無法取得產品清單");
    }
  };

  const handleFileUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append("file-to-upload", file);
    try {
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, data);
      if (res.data.success) callback(res.data.imageUrl);
    } catch (err) {
      alert("上傳失敗");
    }
  };

  // --- 💾 儲存邏輯 (已修正空白行問題) ---
  const handleSave = async () => {
    if (!editorRef.current) return;
    const editorData = await editorRef.current.save();

    // 轉換 Editor.js 的區塊（包含保留空白段落）
    const convertedBlocks = editorData.blocks.map((block) => {
      // ✅ 處理空白行工具
      if (block.type === "emptyLine") {
        return { type: "paragraph", content: "<!--EMPTY_LINE-->" };
      }
      
      if (block.type === "paragraph" || block.type === "header") {
        let text = block.data.text || "";
        // ✅ 關鍵修正：檢查是否為空白行（包含零寬空格的情況）
        const cleanedText = text.replace(/\u200B/g, "").trim(); // 移除零寬空格後檢查
        
        if (!cleanedText) {
          // 這是空白行，標記為特殊字符
          text = "<!--EMPTY_LINE-->";
        } else {
          text = text.replace(/\n/g, "<br>");
        }
        
        return block.type === "paragraph" 
          ? { type: "paragraph", content: text }
          : { type: "heading", level: block.data.level, content: text };
      }
      if (block.type === "image")
        return { type: "image", imageUrl: block.data.url, caption: block.data.caption || "" };
      return null;
    }).filter((b) => b);

    // 💡 關鍵點 1: 推入商品區塊
    convertedBlocks.push({ 
      type: "relatedProducts", 
      title: "與植物相遇的傳送門", 
      products: relatedProducts 
    });

    // 💡 關鍵點 2: 強制推入留言區塊 (確保每則留言都有 create_at)
    const commentsWithTimestamp = comments.map(comment => ({
      ...comment,
      // 確保每則留言都有時間戳，如果沒有就使用當前時間
      create_at: comment.create_at || Math.floor(Date.now() / 1000)
    }));

    convertedBlocks.push({ 
      type: "commentSection", 
      title: "留言與討論", 
      comments: commentsWithTimestamp
    });

    const payload = {
      data: {
        ...formData,
        title: formData.title.replace(/\n/g, "<br>"),
        tag: selectedTags,
        create_at: Math.floor(new Date(formData.create_at).getTime() / 1000),
        content: formData.description || " ", 
        contentBlocks: convertedBlocks,
      },
    };

    try {
      const url = editId
        ? `${API_BASE}/api/${API_PATH}/admin/article/${editId}`
        : `${API_BASE}/api/${API_PATH}/admin/article`;
      await axios[editId ? "put" : "post"](url, payload);
      alert("✅ 儲存成功！");
      resetForm();
      fetchArticles();
    } catch (err) {
      alert("儲存失敗");
    }
  };

  // --- 📖 讀取邏輯 (已修正空白行問題) ---
  const handleEdit = async (article) => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/article/${article.id}`);
      const d = res.data.article;
      setEditId(d.id);

      setFormData({
        title: d.title.replace(/<br\s*\/?>/gi, "\n"),
        description: d.description || "",
        image: d.image,
        author: d.author || "森活小編",
        isPublic: d.isPublic,
        create_at: new Date(d.create_at * 1000).toISOString().split("T")[0],
      });

      setSelectedTags(d.tag || []);
      const blocks = d.contentBlocks || [];
      
      // 分別取出商品與留言（確保留言都有時間戳）
      setRelatedProducts(blocks.find((b) => b.type === "relatedProducts")?.products || []);
      const loadedComments = blocks.find((b) => b.type === "commentSection")?.comments || [];
      // 確保每則載入的留言都有 create_at
      const commentsWithTimestamp = loadedComments.map(comment => ({
        ...comment,
        create_at: comment.create_at || Math.floor(Date.now() / 1000)
      }));
      setComments(commentsWithTimestamp);

      const editorBlocks = blocks.filter((b) => ["paragraph", "heading", "image"].includes(b.type)).map((b) => {
        if (b.type === "paragraph" || b.type === "heading") {
          let cleanText = (b.content || "").replace(/<br\s*\/?>/gi, "\n");
          
          // ✅ 關鍵修正：檢查空白行佔位符，轉換為 emptyLine 工具
          if (cleanText.trim() === "<!--EMPTY_LINE-->") {
            return { type: "emptyLine", data: { isEmpty: true } };
          }
          
          return { 
            type: b.type === "heading" ? "header" : "paragraph", 
            data: { text: cleanText, level: b.level || 3 } 
          };
        }
        if (b.type === "image")
          return { type: "image", data: { url: b.imageUrl, caption: b.caption } };
        return null;
      }).filter((b) => b);

      if (editorRef.current) {
        await editorRef.current.render({ blocks: editorBlocks });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("讀取失敗");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ title: "", description: "", image: "", create_at: "", author: "森活小編", isPublic: true });
    setSelectedTags([]);
    setRelatedProducts([]);
    setComments([]);
    if (editorRef.current) editorRef.current.clear();
  };

  return (
    <div className="container py-5 mx-auto" style={{ maxWidth: "950px" }}>
      <style>{`
        .ce-paragraph, .ce-header { white-space: pre-wrap !important; min-height: 1.2em; }
        .codex-editor { z-index: 0 !important; }
        .ce-block { margin-bottom: 0px; }
      `}</style>

      {/* 頁首標籤 */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body bg-dark text-white rounded d-flex justify-content-between align-items-center py-2 px-4">
          <h5 className="mb-0 fw-bold">🌿 森活 CMS 管理系統</h5>
          <span className="badge bg-success">已連線至後台</span>
        </div>
      </div>

      <div className="card shadow-sm border-0 p-4 mb-5 bg-white">
        {/* 文章基礎資訊表單 */}
        <div className="row g-3 mb-4 p-3 bg-light rounded border">
          <div className="col-md-9">
            <label className="small fw-bold">文章標題 *</label>
            <textarea className="form-control shadow-sm" rows="2" style={{ resize: "none" }} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="small fw-bold">發布日期 *</label>
            <input type="date" className="form-control shadow-sm" value={formData.create_at} onChange={(e) => setFormData({ ...formData, create_at: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="small fw-bold">作者名稱 *</label>
            <input className="form-control shadow-sm" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
          </div>
          <div className="col-md-5">
            <label className="small fw-bold">主圖 URL *</label>
            <div className="input-group shadow-sm">
              <input className="form-control" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
              <button className="btn btn-outline-secondary" type="button" onClick={() => document.getElementById("cover-up").click()}>📁 上傳</button>
            </div>
            <input type="file" id="cover-up" hidden onChange={(e) => handleFileUpload(e, (url) => setFormData({ ...formData, image: url }))} />
          </div>
          <div className="col-md-3">
            <label className="small fw-bold">發布狀態</label>
            <select className="form-select shadow-sm" value={formData.isPublic} onChange={(e) => setFormData({ ...formData, isPublic: e.target.value === "true" })}>
              <option value="true">公開發布</option>
              <option value="false">草稿</option>
            </select>
          </div>
          <div className="col-12">
            <label className="small fw-bold d-block mb-2">文章標籤 *</label>
            <div className="d-flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <button key={tag} type="button" onClick={() => setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])} className={`btn btn-sm rounded-pill px-3 shadow-sm ${selectedTags.includes(tag) ? "btn-success" : "btn-outline-secondary"}`}>{tag}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor.js 正文區 */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3 border-start border-4 border-success ps-2">文章正文編輯區</h6>
          <div id="editorjs-container" className="border rounded bg-white p-3 shadow-sm" style={{ minHeight: "400px" }}></div>
        </div>

        {/* 商品與留言管理 */}
        <div className="row mb-4">
        <div className="col-md-6 border-end pe-4">
  <h6 className="fw-bold border-bottom pb-2">🛍️ 相關商品</h6>
  <button 
    className="btn btn-sm btn-outline-primary mb-2" 
    onClick={() => setRelatedProducts([...relatedProducts, { name: "", productId: "", img: "" }])}
  >
    + 新增商品
  </button>
  
  {relatedProducts.map((p, i) => (
    <div key={i} className="p-3 border rounded mb-3 bg-white shadow-sm">
      {/* 💡 商品快速選擇器 */}
      <label className="small fw-bold text-success mb-1">快速選取現有商品：</label>
      <select 
        className="form-select form-select-sm mb-2 border-success"
        value={p.productId}
     onChange={(e) => {
  const selectedId = e.target.value;
  if (!selectedId) return; // 💡 增加這一行：如果選回預設選項，直接跳出不執行 find

  const product = allProducts?.find(item => item.id === selectedId);
  const n = [...relatedProducts];
  n[i] = {
    name: product?.title || "", // 使用 Optional Chaining 更安全
    productId: selectedId,
    img: product?.imageUrl || ""
  };
  setRelatedProducts(n);
}}
      >
        <option value="">-- 請選擇商品 --</option>
        {allProducts.map(prod => (
          <option key={prod.id} value={prod.id}>{prod.title}</option>
        ))}
      </select>

      <hr className="my-2 opacity-25" />

      {/* 欄位內容（選中後會自動填入，也可手動修改） */}
      <input 
        className="form-control form-control-sm mb-1" 
        placeholder="商品名稱" 
        value={p.name} 
        onChange={(e) => { const n = [...relatedProducts]; n[i].name = e.target.value; setRelatedProducts(n); }} 
      />
      <input 
        className="form-control form-control-sm mb-1" 
        placeholder="商品 ID" 
        value={p.productId} 
        onChange={(e) => { const n = [...relatedProducts]; n[i].productId = e.target.value; setRelatedProducts(n); }} 
      />
      <div className="d-flex gap-2 align-items-center">
        <input 
          className="form-control form-control-sm" 
          placeholder="圖片 URL" 
          value={p.img} 
          onChange={(e) => { const n = [...relatedProducts]; n[i].img = e.target.value; setRelatedProducts(n); }} 
        />
        {p.img && <img src={p.img} alt="preview" style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="rounded border" />}
      </div>

      <div className="text-end mt-2">
        <button className="btn btn-sm text-danger p-0" onClick={() => setRelatedProducts(relatedProducts.filter((_, idx) => idx !== i))}>
          ✕ 移除商品
        </button>
      </div>
    </div>
  ))}
</div>

          <div className="col-md-6 ps-4">
            <h6 className="fw-bold border-bottom pb-2">💬 留言板內容管理</h6>
            <p className="small text-muted mb-2">
              後台可手動新增/編輯留言，即使清空留言，前台也會保留區塊正常顯示。
            </p>
            
            {/* 新增留言按鈕 */}
            <button 
              className="btn btn-sm btn-outline-success mb-2 w-100" 
              onClick={() => {
                setComments([
                  ...comments, 
                  { 
                    userName: "", 
                    content: "", 
                    create_at: Math.floor(Date.now() / 1000) // ✅ 自動記錄時間戳
                  }
                ]);
              }}
            >
              ➕ 新增留言
            </button>

            {/* 留言列表 */}
            <div className="bg-light p-2 rounded" style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {comments.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <small>目前暫無留言（區塊已保留給前台）</small>
                </div>
              ) : (
                comments.map((c, i) => (
                  <div key={i} className="p-3 border rounded mb-3 bg-white shadow-sm">
                    {/* 使用者名稱 */}
                    <input 
                      className="form-control form-control-sm mb-2" 
                      placeholder="使用者名稱"
                      value={c.userName}
                      onChange={(e) => {
                        const updated = [...comments];
                        updated[i].userName = e.target.value;
                        setComments(updated);
                      }}
                    />
                    
                    {/* 留言內容 */}
                    <textarea 
                      className="form-control form-control-sm mb-2" 
                      placeholder="留言內容"
                      rows="3"
                      value={c.content}
                      onChange={(e) => {
                        const updated = [...comments];
                        updated[i].content = e.target.value;
                        setComments(updated);
                      }}
                    />
                    
                    {/* 時間顯示與刪除按鈕 */}
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        🕒 {c.create_at ? new Date(c.create_at * 1000).toLocaleString('zh-TW', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        }) : '時間未設定'}
                      </small>
                      <button 
                        className="btn btn-sm text-danger p-0" 
                        onClick={() => {
                          if (window.confirm('確定要刪除這則留言嗎？')) {
                            setComments(comments.filter((_, idx) => idx !== i));
                          }
                        }}
                      >
                        ✕ 移除
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 留言統計 */}
            {comments.length > 0 && (
              <div className="mt-2 text-end">
                <small className="text-muted">共 {comments.length} 則留言</small>
              </div>
            )}
          </div>
        </div>

        {/* 儲存按鈕 */}
        <div className="mt-4">
          {editId ? (
            <div className="d-flex gap-3">
              <button className="btn btn-primary btn-lg flex-grow-1 fw-bold shadow py-3" onClick={handleSave}>💾 更新文章 (保留留言區)</button>
              <button className="btn btn-outline-danger btn-lg fw-bold shadow py-3 px-5" onClick={() => window.confirm("確定取消？") && resetForm()}>❌ 取消</button>
            </div>
          ) : (
            <button className="btn btn-success btn-lg w-100 fw-bold shadow py-3" onClick={handleSave}>🚀 發布新文章 (自動建立留言區)</button>
          )}
        </div>
      </div>

      {/* 文章列表 */}
      <div className="list-group">
        {articles.map((a) => (
          <div key={a.id} className="list-group-item d-flex justify-content-between align-items-center mb-2 rounded border-0 shadow-sm p-3 bg-white">
            <div>
              <h6 className="mb-0 fw-bold">{a.title.replace(/<br\s*\/?>/gi, " ")}</h6>
              <small className="text-secondary">{new Date(a.create_at * 1000).toLocaleDateString()}</small>
            </div>
            <div className="btn-group gap-2">
              <button className="btn btn-sm btn-outline-primary px-3 rounded-pill" onClick={() => handleEdit(a)}>編輯</button>
              <button className="btn btn-sm btn-outline-danger px-3 rounded-pill" onClick={() => window.confirm("確定刪除？") && axios.delete(`${API_BASE}/api/${API_PATH}/admin/article/${a.id}`).then(fetchArticles)}>刪除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Articles;