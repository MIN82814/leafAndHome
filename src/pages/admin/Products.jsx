import { useOutletContext } from "react-router";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap"; //引入 Bootstrap
import { useSelector, useDispatch } from "react-redux";
import { getAdminProducts, setAdminProducts } from "../../slice/adminProductSlice";

function Products() {
  const dispatch = useDispatch();
  const { token, API_BASE, API_PATH } = useOutletContext();
  const INITIAL_TEMPLATE_DATA = {
    id: "",
    title: "",
    category: "",
    origin_price: "",
    price: "",
    unit: "",
    description: "",
    content: "",
    is_enabled: false,
    imageUrl: "",
    imagesUrl: [],
    careGuide: {},
    detailedIntro: {},
    placementScenes: [],
    customerReviews: [],
  };
  //產品清單列表
  const [product, setProduct] = useState([]);
  // useRef 建立對 DOM 元素的參照
  const productModalRef = useRef(null);
  const [modalType, setModalType] = useState(""); // "create", "edit", "delete"
  const [templateData, setTemplateData] = useState(INITIAL_TEMPLATE_DATA);
  const adminProducts = useSelector(getAdminProducts);
  //API 取得產品列表
  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      console.log(response.data.products);
      setProduct(response.data.products);
      dispatch(setAdminProducts(response.data.products));
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  useEffect(() => {
    console.log("這是adminProducts", adminProducts);
  }, [adminProducts]);

  // 新增、編輯產品
  const updateProduct = async (id) => {
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";

    if (modalType === "edit") {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    }
    const productData = {
      //資料轉型、防呆
      data: {
        ...templateData,
        origin_price: Number(templateData.origin_price),
        price: Number(templateData.price),
        is_enabled: templateData.is_enabled ? 1 : 0,
        imagesUrl: [...templateData.imagesUrl.filter((url) => url !== "")],
      },
    };
    try {
      const response = await axios[method](url, productData);
      console.log(response.data);
      getProducts();
      closeModal();
      // console.log(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // 刪除產品
  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      console.log(response.data);
      getProducts();
      closeModal();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }
    productModalRef.current = new bootstrap.Modal("#productModal", { keyboard: false });

    document.querySelector("#productModal").addEventListener("hide.bs.modal", () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
    (async () => {
      await getProducts();
    })(); //確認正確後取得產品列表內容
  }, []);

  // 透過useRef控制 Modal
  const openModal = (type, product) => {
    //現有資料->寫入產品的資料
    console.log(product);
    setTemplateData((prev) => ({
      ...prev,
      ...product,
    }));
    setModalType(type);
    console.log(templateData);
    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  // 處理Modal編輯內容。
  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTemplateData((data) => ({
      ...data,
      [name]: type == "checkbox" ? checked : value,
    }));
  };

  //處理Modal編輯圖片的內容 (陣列和物件結構需要另外處理)
  const handleImagesChange = (index, value) => {
    setTemplateData((pre) => {
      const newImage = [...pre.imagesUrl]; //先存放完整的圖片路徑
      newImage[index] = value; //修改希望編輯的圖片
      //如果輸入值不為空，且編輯的圖片為最後一筆，且圖片數量尚低於5時
      if (value !== "" && index === newImage.length - 1 && newImage.length < 5) {
        newImage.push("");
      }
      //如果輸入值為空，且編輯的圖片不是第一筆，且最後一筆是空時
      if (value === "" && newImage.length > 1 && newImage[newImage.length - 1] === "") {
        newImage.pop("");
      }
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  const handleAddImage = () => {
    setTemplateData((pre) => {
      const newImage = [...pre.imagesUrl]; //先存放完整的圖片路徑
      newImage.push("");
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };
  const handleRemoveImage = () => {
    setTemplateData((pre) => {
      const newImage = [...pre.imagesUrl]; //先存放完整的圖片路徑
      newImage.pop();
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  return (
    <>
      <div className="container">
        <h1 className="h1 text-center p-4">後臺管理頁面</h1>
        <hr />
        <div className="row p-3 g-5">
          <div className="col-12">
            <h2 className="h2 text-center">產品列表</h2>
            <div className="text-end mt-4">
              <button type="button" className="btn btn-primary mb-4" onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}>
                建立新的產品
              </button>
            </div>
            <table className="table">
              <thead>
                <tr className="table-primary text-center">
                  <th scope="col">產品分類</th>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">查看細節</th>
                </tr>
              </thead>
              <tbody>
                {product.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="fw-bold">{item.category}</td>
                    <td className="fw-bold">{item.title}</td>
                    <td>{item.origin_price}</td>
                    <td>{item.price}</td>
                    <td className={`fw-bold ${item.is_enabled && "text-success"}`}>{item.is_enabled ? "啟用" : "未啟用"}</td>
                    <td>
                      <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-outline-primary me-2" onClick={() => openModal("edit", item)}>
                          編輯
                        </button>
                        <button type="button" className="btn btn-outline-danger" onClick={() => openModal("delete", item)}>
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div id="productModal" className="modal fade" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true" ref={productModalRef}>
        <div className="modal-dialog modal-xl">
          <div className="modal-content border-0">
            <div className={`modal-header bg-${modalType === "delete" ? "danger text-white" : "info"}`}>
              <h5 id="productModalLabel" className="modal-title">
                {modalType === "delete" ? "刪除產品" : modalType === "edit" ? "編輯產品" : "新增產品"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => closeModal()}></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址(主圖)
                      </label>
                      <input type="text" id="imageUrl" name="imageUrl" className="form-control" placeholder="請輸入圖片連結" value={templateData.imageUrl} onChange={(e) => handleModalInputChange(e)} />
                    </div>
                    {templateData.imageUrl && <img className="img-fluid" src={templateData.imageUrl} alt="主圖" />}
                  </div>
                  <div>
                    {templateData.imagesUrl.map((url, index) => (
                      <div key={index}>
                        <label htmlFor="imageUrl" className="form-label">
                          輸入圖片網址{index + 1}
                        </label>
                        <input type="text" className="form-control" value={url} onChange={(e) => handleImagesChange(index, e.target.value)} placeholder={`圖片網址${index + 1}`} />
                        {url && <img className="img-fluid" src={url} alt={`副圖${index + 1}`} />}
                      </div>
                    ))}

                    <button className="btn btn-outline-primary btn-sm d-block w-100" onClick={() => handleAddImage()}>
                      新增圖片
                    </button>
                  </div>
                  <div>
                    <button className="btn btn-outline-danger btn-sm d-block w-100" onClick={() => handleRemoveImage()}>
                      刪除圖片
                    </button>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input name="title" id="title" type="text" className="form-control" placeholder="請輸入標題" value={templateData.title} onChange={(e) => handleModalInputChange(e)} />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input name="category" id="category" type="text" className="form-control" placeholder="請輸入分類" value={templateData.category} onChange={(e) => handleModalInputChange(e)} />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input name="unit" id="unit" type="text" className="form-control" placeholder="請輸入單位" value={templateData.unit} onChange={(e) => handleModalInputChange(e)} />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input name="origin_price" id="origin_price" type="number" min="0" className="form-control" placeholder="請輸入原價" value={templateData.origin_price} onChange={(e) => handleModalInputChange(e)} />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input name="price" id="price" type="number" min="0" className="form-control" placeholder="請輸入售價" value={templateData.price} onChange={(e) => handleModalInputChange(e)} />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea name="description" id="description" className="form-control" placeholder="請輸入產品描述" value={templateData.description} onChange={(e) => handleModalInputChange(e)}></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea name="content" id="content" className="form-control" placeholder="請輸入說明內容" value={templateData.content} onChange={(e) => handleModalInputChange(e)}></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input name="is_enabled" id="is_enabled" className="form-check-input" type="checkbox" checked={templateData.is_enabled} onChange={(e) => handleModalInputChange(e)} />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                  <div>光線需求: {templateData.careGuide.light}</div>
                  <div>照顧難度: {templateData.careGuide.difficulty}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {modalType === "delete" ? (
                <>
                  <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={() => closeModal()}>
                    取消
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => deleteProduct(templateData.id)}>
                    刪除
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={() => closeModal()}>
                    取消
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => updateProduct(templateData.id)}>
                    確認
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
