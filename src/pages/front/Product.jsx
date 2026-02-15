import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Title from "../../component/Title";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  const addCart = async (id) => {
    const data = {
      product_id: id,
      qty: 1,
    };
    try {
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, { data });
      console.log(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
        setProduct(response.data.product);
        console.log(response.data.product);
        console.log("product:", product);
      } catch (error) {
        console.log(error.response);
      }
    };
    getSingleProduct();
  }, []);

  if (!product)
    return (
      <>
        <div className="container">
          <div className="py-11 py-md-14">
            <div className="text-center mb-6 mb-md-13">
              <Title title="查無產品" />
            </div>
          </div>
        </div>
      </>
    );
  return (
    <>
      {/* {JSON.stringify(product)} */}
      <section className="bg-neutral-100 py-11 py-md-14">
        <div className="container">
          <div className="d-flex gap-9">
            <div className="d-flex gap-6 product-image-area">
              <div className="d-flex flex-column gap-3 prduct-image-selection">
                {product?.imagesUrl?.map((image) => (
                  <img src={image} className="" alt={product.title} />
                ))}
              </div>
              <div className="">
                <img src={product.imageUrl} className="" alt={product.title} />
              </div>
            </div>
            <div className="">
              <h6 className="h5">{product.titleEn}</h6>
              <h2 className="h2">{product.titleZh}</h2>
              <p>✦ 全館滿兩千免運 ✦</p>
              <h4 className="text-neutral-900 h4">
                {product.price}
                <span className="text-neutral-500 fw-bold">{product.origin_price}</span>
              </h4>
              <p>數量</p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-secondary-500 py-10">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="d-flex justify-content-center">
                <div>
                  <h4 className="h4">七天到貨</h4>
                  <h6 className="h6">新鮮直送</h6>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="d-flex justify-content-center">
                <div>
                  <h4 className="h4">七天到貨</h4>
                  <h6 className="h6">新鮮直送</h6>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="d-flex justify-content-center">
                <div>
                  <h4 className="h4">七天到貨</h4>
                  <h6 className="h6">新鮮直送</h6>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="d-flex justify-content-center">
                <div>
                  <h4 className="h4">七天到貨</h4>
                  <h6 className="h6">新鮮直送</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-neutral-200  py-11 py-md-14">
        <div className="container">
          <div className="text-center mb-6 mb-md-13">
            <Title title="照顧指南" />
          </div>
          <div className="text-center">
            {product?.careGuide?.difficulty}
            {product?.careGuide?.humidity}
            {product?.careGuide?.light}
            {product?.careGuide?.petSafety}
            {product?.careGuide?.size}
            {product?.careGuide?.supportRepotting}
            {product?.careGuide?.temperature}
            {product?.careGuide?.watering}
          </div>
        </div>
      </section>
      <section className="bg-neutral-100  py-11 py-md-14">
        <div className="container">
          <div className="text-center mb-6 mb-md-13">
            <Title title="詳細介紹" />
          </div>
          <div className="text-center">
            {product?.detailedIntro?.benefits}
            {product?.detailedIntro?.careNotes}
            {product?.detailedIntro?.benefits}
          </div>
        </div>
      </section>
      <section className="bg-neutral-200  py-11 py-md-14">
        <div className="container">
          <div className="text-center mb-6 mb-md-13">
            <Title title="適合擺放情境" />
          </div>
          <div className="text-center"></div>
        </div>
      </section>
      <section className="bg-neutral-100  py-11 py-md-14">
        <div className="container">
          <div className="text-center mb-6 mb-md-13">
            <Title title="顧客評價" />
          </div>
          <div className="text-center"></div>
        </div>
      </section>
      {/* <div className="col-md-4 mb-3" key={product.id}>
        <div className="card">
          <img src={product.imageUrl} className="card-img-top" alt={product.title} />
          <div className="card-body">
            <h5 className="card-title">{product.title}</h5>
            <p className="card-text">{product.description}</p>
            <p className="card-text">價格: {product.price}</p>
            <p className="card-text">
              <small className="text-body-secondary">{product.unit}</small>
            </p>
            <button type="button" className="btn btn-primary" onClick={() => addCart(product.id)}>
              加入購物車
            </button>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default Product;
