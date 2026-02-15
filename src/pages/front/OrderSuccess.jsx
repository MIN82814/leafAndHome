import { useEffect } from "react";
import { useParams } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function OrderSuccess() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();

  const fetchOrderData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/order/${id}`);
      console.log(res.data);
      setOrderData(res.data.order);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);
  return (
    <div className=" container d-flex flex-column align-items-center gap-5 cart-table">
      {/* <div className="text-center"> */}
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
        alt=""
        style={{ width: "200px", height: "200px" }}
      />
      {/* </div> */}
      <h3>付款成功！</h3>
      <h5>感謝您的消費</h5>
      <div className="bg-secondary-100 px-4 py-6 rounded-4 border">
        <span>訂單編號:{id}</span>
      </div>
      <div className="d-flex justify-content-start align-items-center bg-neutral-200 rounded-4 gap-2 px-4 py-6">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
          alt=""
          style={{
            height: "100px",
            width: "100px",
            objectFit: "cover",
          }}
        />
        <div className="d-flex flex-column">
          <span>確認信件已發送</span>
          <span>
            我們已將確認信件發送至
            <span style={{ color: "#222222", fontWeight: "bold" }}>
              {orderData?.user?.email}
            </span>
            ，您可以在信件中查看訂單明細及寄送進度
          </span>
        </div>
      </div>
      <div className="section border w-100">
        <div className="head d-flex justify-content-between py-4 px-6 bg-secondary-100">
          <h4 className="text-secondary-700">訂單內容</h4>
        </div>
        <div className="p-4 bg-white">
          <table className="table cart-table table-hover d-none d-lg-table">
            <thead>
              <tr>
                <th>商品</th>
                <th scope="col">單價</th>
                <th scope="col">數量</th>
                <th scope="col">總價</th>
              </tr>
            </thead>
            <tbody>
              {orderData?.products &&
                Object.entries(orderData.products).map(([key, value]) => {
                  return (
                    <tr key={key}>
                      <td style={{ width: "400px" }}>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={value.product.imageUrl}
                            style={{
                              height: "100px",
                              width: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="d-flex flex-column">
                            <span className="titleZh">
                              {value.product.titleZh}
                            </span>
                            <span className="titleEn">
                              {value.product.titleEn}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle price">
                        ${value.product.price}
                      </td>
                      <td className="align-middle">{value.qty}</td>
                      <td className="align-middle total">${value.total}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {/*mobile DOM*/}
          <div className="d-block d-lg-none">
            {orderData?.products &&
              Object.entries(orderData.products).map(([key, value]) => {
                return (
                  <div key={key} className="cart-card mb-3 p-3 rounded">
                    {/* 商品資訊 */}
                    <div className="d-flex gap-3 mb-3">
                      <img
                        src={value.product.imageUrl}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />

                      <div>
                        <div className="titleZh">{value.product.titleZh}</div>
                        <div className="titleEn">{value.product.titleEn}</div>
                      </div>
                    </div>

                    {/* 單價 */}
                    <div className="d-flex justify-content-end mb-2">
                      <span>NT $ {value.product.price}</span>
                    </div>

                    {/* 數量 */}
                    <div className="d-flex justify-content-between align-items-center">
                      <span>數量：{value.qty}</span>
                      {/* 總價 */}
                      <div className="d-flex justify-content-between fw-bold">
                        <span>NT $ {value.total}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="section bg-white p-6 w-100">
        <div className="row d-flex">
          <div className="col-lg-6 d-flex flex-column mb-5 ">
            <div className="mb-5">
              <h4 style={{ color: "#74613e" }}>寄件資訊</h4>
            </div>
            <div className="mb-2 d-flex flex-column">
              <span style={{ color: "#222222" }}>
                {orderData?.user && orderData.user.name}
              </span>
              <span style={{ color: "#222222" }}>
                {orderData?.user && orderData.user.tel}
              </span>
              <span style={{ color: "#222222" }}>
                {orderData?.user && orderData.user.address}
              </span>
            </div>
            <div className="d-flex flex-column mb-2">
              <span style={{ color: "#666666" }}>預計抵達日:</span>
              <span style={{ color: "#222222" }}>3-7個工作天</span>
            </div>
            <div className="mb-5 d-flex flex-column">
              <span style={{ color: "#666666" }}>訂單備注:</span>
              <span style={{ color: "#222222" }}>
                {orderData ? orderData.message : ""}
              </span>
            </div>
          </div>
          <div className="col-lg-6 d-flex flex-column">
            <div className="mb-5">
              <h4 style={{ color: "#74613e" }}>付款資訊</h4>
            </div>
            <span style={{ color: "#222222" }}>貨到付款</span>
            <span style={{ color: "#222222" }}>二聯電子發票</span>
          </div>
        </div>
      </div>
      <div className="section bg-white p-6 w-100">
        <div className="d-flex flex-column">
          <div className="mb-5">
            <h3 style={{ color: "#74613e" }}>訂單明細</h3>
          </div>
          <div className="d-flex justify-content-between">
            <h6 className="text-neutral-700">商品總金額</h6>
            <h6 className="text-neutral-900">
              ${orderData?.id && orderData.total}
            </h6>
          </div>
          <div className="d-flex justify-content-between">
            <h6 className="text-neutral-700">運費總金額</h6>
            <h6 className="text-neutral-900">$120</h6>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h6 className="text-neutral-900">總付款金額</h6>
            <h6 className="text-neutral-900 fw-bold fs-5">
              {orderData ? `$${Number(orderData.total) + 120}` : "$0"}
            </h6>
          </div>
        </div>
      </div>
      <div className="d-flex mb-5 gap-2 w-100">
        <button type="button" className="btn btn-outline-primary-500 w-100">
          追蹤訂單
        </button>
        <button
          type="button"
          className="btn btn-primary-500 text-white w-100"
          onClick={() => navigate("/products")}
        >
          繼續逛逛
        </button>
      </div>
    </div>
  );
}
