import axios from "axios";
import { useEffect, useState } from "react";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import { useForm } from "react-hook-form";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cartData, setCartData] = useState([]);
  const subtotal = cartData.reduce((sum, item) => sum + item.total, 0);
  const shipping = cartData.length > 0 ? 120 : 0;
  const total = subtotal + shipping;

  const [couponApplied, setCouponApplied] = useState(
    location.state?.couponApplied || false,
  );
  const [couponCode, setCouponCode] = useState(
    location.state?.couponCode || "",
  );
  const [totalAfterCoupon, setTotalAfterCoupon] = useState(
    location.state?.totalAfterCoupon || total,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //onSubmit
  const onSubmit = async (data) => {
    const fullAddress =
      data.postcode + data.city + data.section + data.detailAddress;
    const orderData = {
      data: {
        user: {
          name: data.name,
          email: data.email,
          tel: data.tel,
          address: fullAddress,
        },
        message: data.remark,
      },
    };

    try {
      const res = await axios.post(
        `${API_BASE}/api/${API_PATH}/order`,
        orderData,
      );
      console.log("訂單建立成功", res.data);
      const orderId = res.data.orderId;
      navigate(`/cart/order-success/${orderId}`);
    } catch (error) {
      console.error(error);
      alert("建立訂單失敗");
    }
  };

  //fetchCartData function
  const fetchCartData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCartData(res.data.data.carts);
      console.log(res.data.data.carts);
    } catch (error) {
      alert(error.message);
    }
  };

  //useEffect
  useEffect(() => {
    fetchCartData();
  }, []);

  //updateCart
  const updateCartItemQty = async (itemId, newQty) => {
    const data = {
      product_id: itemId,
      qty: newQty,
    };
    try {
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${itemId}`, {
        data,
      });
      fetchCartData();
    } catch (err) {
      console.error(err);
      alert("更新失敗");
    }
  };

  //deletecart
  const deleteCart = async (itemId) => {
    try {
      const res = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${itemId}`,
      );
      fetchCartData();
    } catch (error) {
      console.error(error);
      alert("刪除失敗");
    }
  };

  //deletecarts
  const deleteCarts = async () => {
    try {
      const res = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      fetchCartData();
    } catch (error) {
      console.error(error);
      alert("刪除失敗");
    }
  };

  //applyCoupon
  const applyCoupon = async () => {
    const data = {
      code: couponCode,
    };
    try {
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/coupon`, {
        data,
      });
      if (res.data.success) {
        setCouponApplied(true);
        setTotalAfterCoupon(res.data.data.final_total);
        alert(res.data.message);
      } else {
        alert("優惠卷無效或已過期");
        setCouponApplied(false);
        setTotalAfterCoupon(total);
      }
    } catch (error) {
      alert("優惠卷套用失敗...");
      setCouponApplied(false);
      setTotalAfterCoupon(total);
    }
  };
  return (
    <>
      <div className="container mb-5 cart-table">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-9 ">
              <div className="section mb-4">
                <div className="head d-flex justify-content-between py-4 px-6 bg-secondary-100">
                  <h4 className="text-secondary-700">訂單內容</h4>
                  <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="btn btn-link text-primary-700 fw-bold text-decoration-underline"
                  >
                    返回購物車
                  </button>
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
                      {cartData.map((item) => {
                        return (
                          <tr key={item.id}>
                            <td style={{ width: "400px" }}>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={item.product.imageUrl}
                                  style={{
                                    height: "100px",
                                    width: "100px",
                                    objectFit: "cover",
                                  }}
                                />
                                <div className="d-flex flex-column">
                                  <span className="titleZh">
                                    {item.product.titleZh}
                                  </span>
                                  <span className="titleEn">
                                    {item.product.titleEn}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="align-middle price">
                              NT $ {item.product.price}
                            </td>
                            <td className="align-middle">{item.qty}</td>
                            <td className="align-middle total">
                              NT $ {item.total}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/*mobile DOM*/}
                  <div className="d-block d-lg-none">
                    {cartData.map((item) => {
                      return (
                        <div
                          key={item.id}
                          className="cart-card mb-3 p-3 rounded"
                        >
                          {/* 商品資訊 */}
                          <div className="d-flex gap-3 mb-3">
                            <img
                              src={item.product.imageUrl}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                              }}
                            />

                            <div>
                              <div className="titleZh">
                                {item.product.titleZh}
                              </div>
                              <div className="titleEn">
                                {item.product.titleEn}
                              </div>
                            </div>
                          </div>

                          {/* 單價 */}
                          <div className="d-flex justify-content-end mb-2">
                            <span>NT $ {item.product.price}</span>
                          </div>

                          {/* 數量 */}
                          <div className="d-flex justify-content-between align-items-center">
                            <span>數量：{item.qty}</span>
                            {/* 總價 */}
                            <div className="d-flex justify-content-between fw-bold">
                              <span>NT $ {item.total}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="payment mb-5 section bg-white p-6">
                  <div className="mb-3">
                    <h4 style={{ color: "#74613e" }}>付款與發票</h4>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 d-flex flex-column mb-5">
                      <div className="mb-2">
                        <h5 style={{ color: "#3e5e4d" }}>付款:</h5>
                      </div>
                      <div className="d-flex flex-column">
                        <label style={{ color: "#666666" }} htmlFor="payment">
                          付款方式
                        </label>
                        <select name="" id="payment">
                          <option value="貨到付款">貨到付款</option>
                          <option value="線上刷卡">線上刷卡</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6 d-flex flex-column">
                      <div className="mb-2">
                        <h5 style={{ color: "#3e5e4d" }}>電子發票:</h5>
                      </div>
                      <div className="d-flex flex-column mb-2">
                        <label htmlFor="einvoice" style={{ color: "#666666" }}>
                          電子發票類型
                        </label>
                        <select name="" id="einvoice">
                          <option value="二聯電子發票">二聯電子發票</option>
                          <option value="三聯電子發票">三聯電子發票</option>
                        </select>
                      </div>
                      <div className="d-flex flex-column mb-2">
                        <label htmlFor="email" style={{ color: "#666666" }}>
                          email
                        </label>
                        <input
                          type="text"
                          placeholder="example@plantlife.com"
                          id="email"
                          {...register("email", {
                            required: "請輸入 Email",
                          })}
                        />
                        {errors.email && (
                          <small className="text-danger">
                            {errors.email.message}
                          </small>
                        )}
                      </div>
                      <div className="carrier d-flex gap-4">
                        <div className="type d-flex mb-2 gap-2">
                          <div className="d-flex flex-column">
                            <label
                              htmlFor="carrier"
                              style={{ color: "#666666" }}
                            >
                              載具類型
                            </label>
                            <select
                              name=""
                              id="carrier"
                              defaultValue={""}
                              className="h-100"
                            >
                              <option value="" disabled>
                                請選擇
                              </option>
                              <option value="手機條碼載具">手機條碼載具</option>
                              <option value="會員載具">會員載具</option>
                            </select>
                          </div>
                          <div className="code d-flex flex-column">
                            <label
                              htmlFor="barcode"
                              style={{ color: "#666666" }}
                            >
                              載具條碼
                            </label>
                            <input
                              type="text"
                              placeholder="格式:/123-ABC(共8位字元)"
                              id="barcode"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-1">
                        <input type="checkbox" id="defaultCarrier" />
                        <label
                          htmlFor="defaultCarrier"
                          style={{ color: "#222222" }}
                        >
                          設定為預設載具
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="shipping mb-5 section bg-white p-6">
                  <div className="mb-3">
                    <h4 style={{ color: "#74613e" }}>寄送資訊</h4>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 d-flex flex-column mb-5">
                      <div className="mb-2 ">
                        <h6>收件人資訊:</h6>
                      </div>
                      <div className="d-flex flex-column mb-2">
                        <label htmlFor="name" style={{ color: "#666666" }}>
                          全名
                        </label>
                        <input
                          type="text"
                          id="name"
                          placeholder="請輸入您的姓名"
                          {...register("name", { required: "請輸入姓名" })}
                        />
                        {errors.name && (
                          <small className="text-danger">
                            {errors.name.message}
                          </small>
                        )}
                      </div>
                      <div className="d-flex flex-column">
                        <label htmlFor="tel" style={{ color: "#666666" }}>
                          電話號碼
                        </label>
                        <input
                          type="text"
                          id="tel"
                          placeholder="手機或市話"
                          {...register("tel", {
                            required: "請輸入電話",
                            pattern: {
                              value: /^[0-9\-+() ]+$/,
                              message: "電話格式錯誤",
                            },
                          })}
                        />
                        {errors.tel && (
                          <small className="text-danger">
                            {errors.tel.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 d-flex flex-column">
                      <div className="mb-2">
                        <h6>寄件地址:</h6>
                      </div>
                      <div className="d-flex gap-4 mb-2">
                        <div className="code d-flex flex-column">
                          <label htmlFor="city" style={{ color: "#666666" }}>
                            城市
                          </label>
                          <input
                            type="text"
                            value="台北市"
                            id="city"
                            readOnly
                            {...register("city")}
                          />
                        </div>
                        <div className="type d-flex flex-column">
                          <label htmlFor="section" style={{ color: "#666666" }}>
                            區
                          </label>
                          <select
                            name=""
                            id="section"
                            {...register("section")}
                            className="h-100"
                          >
                            <option value="內湖區">內湖區</option>
                            <option value="大安區">大安區</option>
                            <option value="文山區">文山區</option>
                          </select>
                        </div>
                      </div>
                      <div className="d-flex flex-column mb-2">
                        <label htmlFor="address" style={{ color: "#666666" }}>
                          地址
                        </label>
                        <input
                          type="text"
                          placeholder="街道、巷弄、門號、樓層"
                          id="address"
                          {...register("detailAddress", {
                            required: "請輸入地址",
                          })}
                        />
                        {errors.detailAddress && (
                          <small className="text-danger">
                            {errors.detailAddress.message}
                          </small>
                        )}
                      </div>
                      <div className="d-flex flex-column mb-2">
                        <label htmlFor="postcode" style={{ color: "#666666" }}>
                          郵遞區號
                        </label>
                        <input
                          type="text"
                          placeholder="請輸入郵遞區號"
                          id="postcode"
                          {...register("postcode", {
                            required: "請輸入郵遞區號",
                          })}
                        />
                        {errors.postcode && (
                          <small className="text-danger">
                            {errors.postcode.message}
                          </small>
                        )}
                      </div>
                      <div className="d-flex gap-1">
                        <input type="checkbox" id="defaultInfo" />
                        <label
                          htmlFor="defaultInfo"
                          style={{ color: "#222222" }}
                        >
                          設定為預設結帳資訊
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="d-flex flex-column">
                        <div className="mb-2">
                          <h6>備注:</h6>
                        </div>
                        <textarea
                          className="form-control"
                          id="remark"
                          rows="3"
                          placeholder="管理室代收/電聯時間......"
                          {...register("remark")}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-12 col-lg-3">
              <div
                className="card shadow position-sticky section"
                style={{ top: "16px" }}
              >
                <div className="card-head bg-primary-500 px-6 py-4">
                  <h4 className="card-title text-start text-neutral-100">
                    訂單內容
                  </h4>
                </div>
                <div className="card-body p-4">
                  <div className="d-flex  flex-column  align-items-start w-auto mb-6">
                    <h6 style={{ color: "#3e5e4d" }}>優惠卷</h6>
                    <div className="input-group w-auto">
                      <input
                        type="text"
                        placeholder="輸入優惠碼"
                        className={`form-control ${couponApplied ? "border-success bg-light text-success" : ""}`}
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={couponApplied} // 成功套用後禁用
                      />
                      <button
                        type="button"
                        className={`btn btn-outline-${couponApplied ? "success" : "primary-700"}`}
                        onClick={applyCoupon}
                        disabled={couponApplied}
                      >
                        {couponApplied ? "已套用" : "套用"}
                      </button>
                    </div>
                    {couponApplied && (
                      <small className="text-success mt-1">
                        折扣碼{couponCode}已套用
                      </small>
                    )}
                  </div>
                  <div className="orderBreakDown mb-6">
                    <div className="productPrice d-flex justify-content-between">
                      <h6 style={{ color: "#666666" }}>商品總金額</h6>
                      <h6 style={{ color: "#222222" }}>${subtotal}</h6>
                    </div>
                    <div className="shipping d-flex justify-content-between">
                      <h6 style={{ color: "#666666" }}>運費總金額</h6>
                      <h6 style={{ color: "#222222" }}>${shipping}</h6>
                    </div>
                    <div className="orderPrice d-flex justify-content-between">
                      <h6 style={{ color: "#666666" }}>總付款金額</h6>
                      <h6 style={{ color: "#222222" }}>
                        ${couponApplied ? totalAfterCoupon : total}
                      </h6>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary-500 w-100 text-white mb-6"
                  >
                    完成付款
                  </button>
                  <div className="d-flex flex-column ">
                    <div className="d-flex justify-content-start">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
                        style={{
                          height: "48px",
                          width: "48px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="d-flex flex-column align-items-start">
                        <span
                          className="card-text"
                          style={{ color: "#222222", fontSize: "16px" }}
                        >
                          安心結帳
                        </span>
                        <span
                          className="card-text"
                          style={{ color: "#74613e", fontSize: "12px" }}
                        >
                          SSL加密安全付款
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-start">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
                        style={{
                          height: "48px",
                          width: "48px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="d-flex flex-column align-items-start">
                        <span
                          className="card-text"
                          style={{ color: "#222222", fontSize: "16px" }}
                        >
                          免運費
                        </span>
                        <span
                          className="card-text"
                          style={{ color: "#74613e", fontSize: "12px" }}
                        >
                          全館消費滿$2,000免運費
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-start">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
                        style={{
                          height: "48px",
                          width: "48px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="d-flex flex-column align-items-start">
                        <span
                          className="card-text"
                          style={{ color: "#222222", fontSize: "16px" }}
                        >
                          退貨保證
                        </span>
                        <span
                          className="card-text"
                          style={{ color: "#74613e", fontSize: "12px" }}
                        >
                          7 天鑑賞期，無條件退貨
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-start">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
                        style={{
                          height: "48px",
                          width: "48px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="d-flex flex-column align-items-start">
                        <span
                          className="card-text"
                          style={{ color: "#222222", fontSize: "16px" }}
                        >
                          隱私保護
                        </span>
                        <span
                          className="card-text"
                          style={{ color: "#74613e", fontSize: "12px" }}
                        >
                          個人資料全程保護
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
