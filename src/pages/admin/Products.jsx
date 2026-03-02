import { useState, useRef, useEffect } from "react";
import * as bootstrap from "bootstrap"; //引入 Bootstrap
import Pagination from "../../component/adminPagination";
import ProductModal from "../../component/ProductModal";
import { getAdminProductsApi } from "../../services/product";

function Products() {
  const INITIAL_TEMPLATE_DATA = {
    id: "",
    title: "",
    titleEn: "",
    category: "",
    origin_price: "",
    price: "",
    unit: "",
    description: "",
    content: "",
    is_enabled: false,
    imageUrl: "",
    imagesUrl: [""],
    careGuide: {},
    detailedIntro: { features: [""], careNotes: [""], benefits: [""] },
    placementScenes: [{ scene: "", phrases: [""] }],
    customerReviews: [""],
  };
  //產品清單列表
  const [product, setProduct] = useState([]);
  // useRef 建立對 DOM 元素的參照
  const productModalRef = useRef(null);

  const [modalType, setModalType] = useState(""); // "create", "edit", "delete"
  // 產品表單資料模板
  const [templateData, setTemplateData] = useState(INITIAL_TEMPLATE_DATA);

  //分頁
  const [pagination, setPagination] = useState({});

  //API 取得產品列表
  const getProducts = async (page = 1) => {
    try {
      // const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      const response = await getAdminProductsApi(page);
      console.log(response.data.products);
      setProduct(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
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
            <Pagination pagination={pagination} onChangePage={getProducts} />
          </div>
        </div>
      </div>
      <ProductModal modalType={modalType} templateData={templateData} closeModal={closeModal} getProducts={getProducts} />
    </>
  );
}

export default Products;
