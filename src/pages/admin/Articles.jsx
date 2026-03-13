import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useOutletContext } from "react-router";

// --- 📦 套件引入 ---
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import DragDrop from "editorjs-drag-drop";

// --- 🔗 引入自定義 API 服務 ---
import { deleteAdminArticleApi, getAdminArticleIdApi, getAdminArticlesApi, getAllProductsApi, postAdminArticleApi, postAdminUploadApi, putAdminArticleApi } from "../../services/article";

// --- 📸 自定義圖片插件 ---
class UrlImage {
  static get toolbox() {
    return { title: "Image (URL/Upload)", icon: "📸" };
  }
  constructor({ data, config }) {
    this.data = data;
    this.uploadFn = config.uploadFn;
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
          const res = await this.uploadFn(formData);
          if (res.data.success) this._showImage(res.data.imageUrl);
        } catch {
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

function Articles() {
  // const { token } = useOutletContext();
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
  const [comments, setComments] = useState([]);
  const editorRef = useRef(null);

  const TAG_OPTIONS = ["新手友善", "澆水技巧", "光線需求", "疑難雜症", "居家搭配"];

  // --- 1. 先宣告所有需要的 Callback ---
  const fetchArticles = useCallback(async () => {
    try {
      const res = await getAdminArticlesApi();
      setArticles(res.data.articles || []);
    } catch {
      console.error("無法取得文章列表");
    }
  }, []);

  const fetchAllProducts = useCallback(async () => {
    try {
      const res = await getAllProductsApi();
      if (res.data.success) setAllProducts(res.data.products);
    } catch {
      console.error("無法取得產品清單");
    }
  }, []);

  const resetForm = useCallback(() => {
    setEditId(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      create_at: "",
      author: "森活小編",
      isPublic: true,
    });
    setSelectedTags([]);
    setRelatedProducts([]);
    setComments([]);
    if (editorRef.current) editorRef.current.clear();
  }, []);

  // --- 2. 隨後執行 useEffect ---
  useEffect(() => {
    const initData = async () => {
      await fetchArticles();
      await fetchAllProducts();
      // if (token) {
      //   await fetchArticles();
      //   await fetchAllProducts();
      // }
    };
    initData();

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editorjs-container",
        placeholder: "在此輸入正文... (按 Shift+Enter 可在區塊內換行)",
        tools: {
          header: { class: Header, config: { levels: [3], defaultLevel: 3 } },
          image: { class: UrlImage, config: { uploadFn: postAdminUploadApi } },
        },
        onReady: () => {
          if (editorRef.current) new DragDrop(editorRef.current);
        },
      });
      editorRef.current = editor;
    }
    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
    // }, [token, fetchArticles, fetchAllProducts]);
  }, [fetchArticles, fetchAllProducts]);

  const handleFileUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append("file-to-upload", file);
    try {
      const res = await postAdminUploadApi(data);
      if (res.data.success) callback(res.data.imageUrl);
    } catch {
      alert("上傳失敗");
    }
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    const editorData = await editorRef.current.save();
    const convertedBlocks = editorData.blocks
      .map((block) => {
        if (block.type === "paragraph" || block.type === "header") {
          let text = block.data.text || "";
          const cleanedText = text.replace(/\u200B/g, "").trim();
          if (!cleanedText) text = "";
          else text = text.replace(/\n/g, "<br>");
          return block.type === "paragraph" ? { type: "paragraph", content: text } : { type: "heading", level: block.data.level, content: text };
        }
        if (block.type === "image")
          return {
            type: "image",
            imageUrl: block.data.url,
            caption: block.data.caption || "",
          };
        return null;
      })
      .filter((b) => b);

    convertedBlocks.push({
      type: "relatedProducts",
      title: "與植物相遇的傳送門",
      products: relatedProducts,
    });
    convertedBlocks.push({
      type: "commentSection",
      title: "留言與討論",
      comments: comments.map((c) => ({
        ...c,
        create_at: c.create_at || Math.floor(Date.now() / 1000),
      })),
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
      if (editId) await putAdminArticleApi(editId, payload);
      else await postAdminArticleApi(payload);
      alert("✅ 儲存成功！");
      resetForm();
      fetchArticles();
    } catch {
      alert("儲存失敗");
    }
  };

  const handleEdit = async (article) => {
    try {
      const res = await getAdminArticleIdApi(article.id);
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
      setRelatedProducts(blocks.find((b) => b.type === "relatedProducts")?.products || []);
      setComments(
        (blocks.find((b) => b.type === "commentSection")?.comments || []).map((c) => ({
          ...c,
          create_at: c.create_at || Math.floor(Date.now() / 1000),
        })),
      );

      const editorBlocks = blocks
        .filter((b) => ["paragraph", "heading", "image"].includes(b.type))
        .map((b) => {
          if (b.type === "paragraph" || b.type === "heading") {
            let cleanText = (b.content || "").replace(/<br\s*\/?>/gi, "\n");
            return {
              type: b.type === "heading" ? "header" : "paragraph",
              data: { text: cleanText, level: b.level || 3 },
            };
          }
          if (b.type === "image")
            return {
              type: "image",
              data: { url: b.imageUrl, caption: b.caption },
            };
          return null;
        })
        .filter((b) => b);

      if (editorRef.current) await editorRef.current.render({ blocks: editorBlocks });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      alert("讀取失敗");
    }
  };

  return (
    <div className="container py-5 mx-auto" style={{ maxWidth: "950px" }}>
      <style>{`.ce-paragraph, .ce-header { white-space: pre-wrap !important; min-height: 1.2em; } .codex-editor { z-index: 0 !important; } .ce-block { margin-bottom: 0px; }`}</style>
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body bg-dark text-white rounded d-flex justify-content-between align-items-center py-2 px-4">
          <h5 className="mb-0 fw-bold">🌿 森活 CMS 管理系統</h5>
          <span className="badge bg-success">已連線至後台</span>
        </div>
      </div>
      <div className="card shadow-sm border-0 p-4 mb-5 bg-white">
        <div className="row g-3 mb-4 p-3 bg-light rounded border">
          <div className="col-md-9">
            <label className="small fw-bold">文章標題 *</label>
            <textarea className="form-control shadow-sm" rows="2" style={{ resize: "none" }} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="small fw-bold">發布日期 *</label>
            <input type="date" className="form-control shadow-sm" value={formData.create_at} onChange={(e) => setFormData({ ...formData, create_at: e.target.value })} />
          </div>
          <div>
            <label className="small fw-bold">文章簡述 (Description)</label>
            <textarea className="form-control shadow-sm" rows="2" placeholder="輸入文章摘要..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="small fw-bold">作者名稱 *</label>
            <input className="form-control shadow-sm" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
          </div>
          <div className="col-md-5">
            <label className="small fw-bold">主圖 URL *</label>
            <div className="input-group shadow-sm">
              <input className="form-control" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
              <button className="btn btn-outline-secondary" type="button" onClick={() => document.getElementById("cover-up").click()}>
                📁 上傳
              </button>
            </div>
            <input type="file" id="cover-up" hidden onChange={(e) => handleFileUpload(e, (url) => setFormData({ ...formData, image: url }))} />
          </div>
          <div className="col-md-3">
            <label className="small fw-bold">發布狀態</label>
            <select
              className="form-select shadow-sm"
              value={formData.isPublic}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isPublic: e.target.value === "true",
                })
              }>
              <option value="true">公開發布</option>
              <option value="false">草稿</option>
            </select>
          </div>
          <div>
            <label className="small fw-bold d-block mb-2">文章標籤 *</label>
            <div className="d-flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <button key={tag} type="button" onClick={() => setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))} className={`btn btn-sm rounded-pill px-3 shadow-sm ${selectedTags.includes(tag) ? "btn-success" : "btn-outline-secondary"}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h6 className="fw-bold mb-3 border-start border-4 border-success ps-2">文章正文編輯區</h6>
          <div id="editorjs-container" className="border rounded bg-white p-3 shadow-sm" style={{ minHeight: "400px" }}></div>
        </div>
        <div className="row mb-4">
          <div className="col-md-6 border-end pe-4">
            <h6 className="fw-bold border-bottom pb-2">🛍️ 相關商品</h6>
            <button type="button" className="btn btn-sm btn-outline-primary mb-2" onClick={() => setRelatedProducts([...relatedProducts, { name: "", productId: "", img: "" }])}>
              + 新增商品
            </button>
            {relatedProducts.map((p, i) => (
              <div key={i} className="p-3 border rounded mb-3 bg-white shadow-sm">
                <label className="small fw-bold text-success mb-1">快速選取現有商品：</label>
                <select
                  className="form-select form-select-sm mb-2 border-success"
                  value={p.productId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    if (!selectedId) return;
                    const product = allProducts?.find((item) => item.id === selectedId);
                    const n = [...relatedProducts];
                    n[i] = {
                      name: product?.title || "",
                      productId: selectedId,
                      img: product?.imageUrl || "",
                    };
                    setRelatedProducts(n);
                  }}>
                  <option value="">-- 請選擇商品 --</option>
                  {allProducts.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.title}
                    </option>
                  ))}
                </select>
                <input
                  className="form-control form-control-sm mb-1"
                  placeholder="商品名稱"
                  value={p.name}
                  onChange={(e) => {
                    const n = [...relatedProducts];
                    n[i].name = e.target.value;
                    setRelatedProducts(n);
                  }}
                />
                <input
                  className="form-control form-control-sm mb-1"
                  placeholder="商品 ID"
                  value={p.productId}
                  onChange={(e) => {
                    const n = [...relatedProducts];
                    n[i].productId = e.target.value;
                    setRelatedProducts(n);
                  }}
                />
                <div className="d-flex gap-2 align-items-center">
                  <input
                    className="form-control form-control-sm"
                    placeholder="圖片 URL"
                    value={p.img}
                    onChange={(e) => {
                      const n = [...relatedProducts];
                      n[i].img = e.target.value;
                      setRelatedProducts(n);
                    }}
                  />
                  {p.img && (
                    <img
                      src={p.img}
                      alt="preview"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                      className="rounded border"
                    />
                  )}
                </div>
                <div className="text-end mt-2">
                  <button type="button" className="btn btn-sm text-danger p-0" onClick={() => setRelatedProducts(relatedProducts.filter((_, idx) => idx !== i))}>
                    ✕ 移除商品
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-6 ps-4">
            <h6 className="fw-bold border-bottom pb-2">💬 留言板內容管理</h6>
            <button
              type="button"
              className="btn btn-sm btn-outline-success mb-2 w-100"
              onClick={() =>
                setComments([
                  ...comments,
                  {
                    userName: "",
                    content: "",
                    create_at: Math.floor(Date.now() / 1000),
                  },
                ])
              }>
              ➕ 新增留言
            </button>
            <div className="bg-light p-2 rounded" style={{ maxHeight: "320px", overflowY: "auto" }}>
              {comments.map((c, i) => (
                <div key={i} className="p-3 border rounded mb-3 bg-white shadow-sm">
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
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">🕒 {new Date(c.create_at * 1000).toLocaleString("zh-TW")}</small>
                    <button type="button" className="btn btn-sm text-danger p-0" onClick={() => window.confirm("確定刪除？") && setComments(comments.filter((_, idx) => idx !== i))}>
                      ✕ 移除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          {editId ? (
            <div className="d-flex gap-3">
              <button className="btn btn-primary btn-lg flex-grow-1 fw-bold shadow py-3" onClick={handleSave}>
                💾 更新文章
              </button>
              <button className="btn btn-outline-danger btn-lg fw-bold shadow py-3 px-5" onClick={() => window.confirm("確定取消？") && resetForm()}>
                ❌ 取消
              </button>
            </div>
          ) : (
            <button className="btn btn-success btn-lg w-100 fw-bold shadow py-3" onClick={handleSave}>
              🚀 發布新文章
            </button>
          )}
        </div>
      </div>
      <div className="list-group">
        {articles.map((a) => (
          <div key={a.id} className="list-group-item d-flex justify-content-between align-items-center mb-2 rounded border-0 shadow-sm p-3 bg-white">
            <div>
              <h6 className="mb-0 fw-bold">{a.title.replace(/<br\s*\/?>/gi, " ")}</h6>
              <small className="text-secondary">{new Date(a.create_at * 1000).toLocaleDateString()}</small>
            </div>
            <div className="btn-group gap-2">
              <button type="button" className="btn btn-sm btn-outline-primary px-3 rounded-pill" onClick={() => handleEdit(a)}>
                編輯
              </button>
              <button type="button" className="btn btn-sm btn-outline-danger px-3 rounded-pill" onClick={() => window.confirm("確定刪除？") && deleteAdminArticleApi(a.id).then(() => fetchArticles())}>
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Articles;
