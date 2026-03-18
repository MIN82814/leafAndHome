import axios from "axios";
import { useState } from "react";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
import { useNavigate, useOutletContext } from "react-router";
import { useLocation } from "react-router";
import { useForm } from "react-hook-form";
import useMessage from "../../hooks/useMessage";
import { currency } from "../../utils/filter";
import { emailValidation } from "../../utils/validation";

export default function Checkout() {
  const { carts } = useOutletContext();

  const location = useLocation();
  const navigate = useNavigate();

  // const [cartData, setCartData] = useState([]);
  const subtotal = carts.reduce((sum, item) => sum + item.total, 0);
  const shipping = carts.length > 0 ? 120 : 0;
  const total = subtotal + shipping;

  const [couponApplied, setCouponApplied] = useState(location.state?.couponApplied || false);
  const [couponCode, setCouponCode] = useState(location.state?.couponCode || "");
  const [totalAfterCoupon, setTotalAfterCoupon] = useState(location.state?.totalAfterCoupon || total);
  const { showSuccess, showError } = useMessage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //onSubmit
  const onSubmit = async (data) => {
    const fullAddress = data.postcode + data.city + data.section + data.detailAddress;
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
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/order`, orderData);
      showSuccess("訂單建立成功");
      const orderId = res.data.orderId;
      navigate(`/cart/order-success/${orderId}`);
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  //useEffect
  // useEffect(() => {
  //   fetchCartData();
  // }, []);

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
        showSuccess("優惠券套用成功");
      } else {
        showError("優惠券無效或已過期");
        setCouponApplied(false);
        setTotalAfterCoupon(total);
      }
    } catch (error) {
      showError(error.response.data.message);
      setCouponApplied(false);
      setTotalAfterCoupon(total);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container mb-5 cart-table">
          <div className="row d-flex justify-content-between">
            <div className="col-lg-9 ">
              <div className="section mb-4">
                <div className="head d-flex justify-content-between py-4 px-6 bg-secondary-100">
                  <h4 className="text-secondary-700">訂單內容</h4>
                  <button type="button" onClick={() => navigate("/cart")} className="btn btn-link text-primary-700 fw-bold text-decoration-underline">
                    返回購物車
                  </button>
                </div>
                <div className="p-4 bg-white">
                  {/* 桌機版 購物車 */}
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
                      {carts.map((item) => {
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
                                  <span className="titleZh">{item.product.titleZh}</span>
                                  <span className="titleEn">{item.product.titleEn}</span>
                                </div>
                              </div>
                            </td>
                            <td className="align-middle price">NT $ {currency(item.product.price)}</td>
                            <td className="align-middle">{item.qty}</td>
                            <td className="align-middle total">NT $ {currency(item.total)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* 手機版購物車*/}
                  <div className="d-block d-lg-none">
                    {carts.map((item) => {
                      return (
                        <div key={item.id} className="cart-card mb-3 p-3 rounded">
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
                              <div className="titleZh">{item.product.titleZh}</div>
                              <div className="titleEn">{item.product.titleEn}</div>
                            </div>
                          </div>

                          {/* 單價 */}
                          <div className="d-flex justify-content-end mb-2">
                            <span>NT $ {currency(item.product.price)}</span>
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

              <div className="payment mb-5 section bg-white p-6">
                <div className="mb-3">
                  <h4 className="text-secondary-700">付款與發票</h4>
                </div>
                <div className="row">
                  <div className="col-lg-6 d-flex flex-column mb-5">
                    <div className="mb-2">
                      <h5 className="text-primary-700">付款:</h5>
                    </div>
                    <div className="d-flex flex-column">
                      <label className="text-neutral-700" htmlFor="payment">
                        付款方式
                      </label>
                      <select name="" id="payment" className="form-select">
                        <option value="貨到付款">貨到付款</option>
                        <option value="線上刷卡">線上刷卡</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6 d-flex flex-column">
                    <div className="mb-2">
                      <h5 className="text-primary-700">電子發票:</h5>
                    </div>
                    <div className="d-flex flex-column mb-2">
                      <label htmlFor="einvoice" className="text-neutral-700">
                        電子發票類型
                      </label>
                      <select name="" id="einvoice" className="form-select">
                        <option value="二聯電子發票">二聯電子發票</option>
                        <option value="三聯電子發票">三聯電子發票</option>
                      </select>
                    </div>
                    <div className="d-flex flex-column mb-2">
                      <label htmlFor="email" className="text-neutral-700">
                        email
                      </label>
                      <input type="email" placeholder="example@plantlife.com" id="email" className="form-control" {...register("email", emailValidation)} />
                      {errors.email && <small className="text-danger">{errors.email.message}</small>}
                    </div>
                    <div className="carrier d-flex gap-4">
                      <div className="type d-flex mb-2 gap-2">
                        <div className="d-flex flex-column">
                          <label htmlFor="carrier" className="text-neutral-700">
                            載具類型
                          </label>
                          <select name="" id="carrier" defaultValue={""} className="h-100 form-select">
                            <option value="" disabled>
                              請選擇
                            </option>
                            <option value="手機條碼載具">手機條碼載具</option>
                            <option value="會員載具">會員載具</option>
                          </select>
                        </div>
                        <div className="code d-flex flex-column">
                          <label htmlFor="barcode" className="text-neutral-700">
                            載具條碼
                          </label>
                          <input type="text" placeholder="格式:/123-ABC(共8位字元)" id="barcode" className="form-control" />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-1">
                      <input type="checkbox" id="defaultCarrier" />
                      <label htmlFor="defaultCarrier" className="text-neutral-900">
                        設定為預設載具
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="shipping mb-5 section bg-white p-6">
                <div className="mb-3">
                  <h4 className="text-secondary-700">寄送資訊</h4>
                </div>
                <div className="row">
                  <div className="col-lg-6 d-flex flex-column mb-5">
                    <div className="mb-2 ">
                      <h6>收件人資訊:</h6>
                    </div>
                    <div className="d-flex flex-column mb-2">
                      <label htmlFor="name" className="text-neutral-700">
                        全名
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="請輸入您的姓名"
                        className="form-control"
                        {...register("name", {
                          required: "請輸入姓名",
                          minLength: {
                            value: 2,
                            message: "姓名最少 2 個字",
                          },
                        })}
                      />
                      {errors.name && <small className="text-danger">{errors.name.message}</small>}
                    </div>
                    <div className="d-flex flex-column">
                      <label htmlFor="tel" className="text-neutral-700">
                        電話號碼
                      </label>
                      <input
                        type="tel"
                        id="tel"
                        placeholder="手機或市話"
                        className="form-control"
                        {...register("tel", {
                          required: "請輸入電話",
                          pattern: {
                            value: /^\d+$/,
                            message: "電話僅能輸入數字",
                          },
                          minLength: {
                            value: 8,
                            message: "電話至少 8 碼",
                          },
                        })}
                      />
                      {errors.tel && <small className="text-danger">{errors.tel.message}</small>}
                    </div>
                  </div>
                  <div className="col-lg-6 d-flex flex-column">
                    <div className="mb-2">
                      <h6>寄件地址:</h6>
                    </div>
                    <div className="d-flex gap-4 mb-2">
                      <div className="code d-flex flex-column">
                        <label htmlFor="city" className="text-neutral-700">
                          城市
                        </label>
                        <input type="text" value="台北市" id="city" className="form-control" readOnly {...register("city")} />
                      </div>
                      <div className="type d-flex flex-column">
                        <label htmlFor="section" className="text-neutral-700">
                          區
                        </label>
                        <select name="" id="section" {...register("section")} className="h-100 form-select">
                          <option value="內湖區">內湖區</option>
                          <option value="大安區">大安區</option>
                          <option value="文山區">文山區</option>
                        </select>
                      </div>
                    </div>
                    <div className="d-flex flex-column mb-2">
                      <label htmlFor="address" className="text-neutral-700">
                        地址
                      </label>
                      <input
                        type="text"
                        placeholder="街道、巷弄、門號、樓層"
                        id="address"
                        className="form-control"
                        {...register("detailAddress", {
                          required: "請輸入地址",
                        })}
                      />
                      {errors.detailAddress && <small className="text-danger">{errors.detailAddress.message}</small>}
                    </div>
                    <div className="d-flex flex-column mb-2">
                      <label htmlFor="postcode" className="text-neutral-700">
                        郵遞區號
                      </label>
                      <input
                        type="text"
                        placeholder="請輸入郵遞區號"
                        id="postcode"
                        className="form-control"
                        {...register("postcode", {
                          required: "請輸入郵遞區號",
                        })}
                      />
                      {errors.postcode && <small className="text-danger">{errors.postcode.message}</small>}
                    </div>
                    <div className="d-flex gap-1">
                      <input type="checkbox" id="defaultInfo" />
                      <label htmlFor="defaultInfo" className="text-neutral-900">
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
                      <textarea className="form-control" id="remark" rows="3" placeholder="管理室代收/電聯時間......" {...register("remark")}></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card shadow position-sticky section" style={{ top: "16px" }}>
                <div className="card-head bg-primary-700 px-6 py-4">
                  <h4 className="card-title text-start text-neutral-100">訂單內容</h4>
                </div>
                <div className="card-body p-4">
                  <div className="d-flex  flex-column  align-items-start w-auto mb-6">
                    <h6 className="text-primary-700">優惠券</h6>
                    <div className="input-group w-auto">
                      <input
                        type="text"
                        placeholder="輸入優惠券代碼"
                        className={`form-control ${couponApplied ? "border-success bg-light text-success" : ""}`}
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={couponApplied} // 成功套用後禁用
                      />
                      <button type="button" className={`btn btn-outline-${couponApplied ? "success" : "primary-700"}`} onClick={applyCoupon} disabled={couponApplied}>
                        {couponApplied ? "已套用" : "套用"}
                      </button>
                    </div>
                    {couponApplied && <small className="text-success mt-1">折扣碼{couponCode}已套用</small>}
                  </div>
                  <div className="orderBreakDown mb-6">
                    <div className="productPrice d-flex justify-content-between">
                      <h6 className="text-neutral-700">商品總金額</h6>
                      <h6 className="text-neutral-900">${currency(subtotal)}</h6>
                    </div>
                    <div className="shipping d-flex justify-content-between">
                      <h6 className="text-neutral-700">運費總金額</h6>
                      <h6 className="text-neutral-900">${currency(shipping)}</h6>
                    </div>
                    <div className="orderPrice d-flex justify-content-between">
                      <h6 className="text-neutral-700">總付款金額</h6>
                      <h6 className="text-neutral-900">${couponApplied ? currency(totalAfterCoupon) : currency(total)}</h6>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary-500 w-100 text-white mb-6">
                    完成付款
                  </button>
                  <div className="d-flex flex-column ">
                    <div className="d-flex justify-content-start gap-2 mb-2">
                      <div className="p-3 rounded-circle bg-background-200 lh-1">
                        <span className="material-symbols-outlined text-secondary-500 lh-1" style={{ fontSize: "24px" }}>
                          security
                        </span>
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <span className="card-text" style={{ color: "#222222", fontSize: "16px" }}>
                          安心結帳
                        </span>
                        <span className="card-text text-secondary-700" style={{ fontSize: "12px" }}>
                          SSL加密安全付款
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-start gap-2 mb-2">
                      <div className="p-3 rounded-circle bg-background-200 lh-1">
                        <span className="material-symbols-outlined text-secondary-500 lh-1" style={{ fontSize: "24px" }}>
                          local_shipping
                        </span>
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <span className="card-text text-neutral-900" style={{ fontSize: "16px" }}>
                          免運費
                        </span>
                        <span className="card-text text-secondary-700" style={{ fontSize: "12px" }}>
                          全館消費滿$2,000免運費
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-start gap-2 mb-2">
                      <div className="p-3 rounded-circle bg-background-200 lh-1">
                        <span className="material-symbols-outlined text-secondary-500 lh-1" style={{ fontSize: "24px" }}>
                          replay
                        </span>
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <span className="card-text text-neutral-900" style={{ fontSize: "16px" }}>
                          退貨保證
                        </span>
                        <span className="card-text text-secondary-700" style={{ fontSize: "12px" }}>
                          7 天鑑賞期，無條件退貨
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-start gap-2 mb-2">
                      <div className="p-3 rounded-circle bg-background-200 lh-1">
                        <span className="material-symbols-outlined text-secondary-500 lh-1" style={{ fontSize: "24px" }}>
                          lock
                        </span>
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <span className="card-text text-neutral-900" style={{ fontSize: "16px" }}>
                          隱私保護
                        </span>
                        <span className="card-text text-secondary-700" style={{ fontSize: "12px" }}>
                          個人資料全程保護
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 🔥 Mobile Fixed Checkout Bar */}
        <div className="mobile-checkout-bar d-md-none">
          <div className="d-flex flex-column justify-content-between align-items-start px-4 py-3 bg-white shadow-lg">
            <div className="w-100 d-flex justify-content-between align-items-center mb-4">
              <div className="text-neutral-700 fw-bold fs-6">總付款金額</div>
              <div className="fw-bold text-neutral-900 fs-4">${couponApplied ? currency(totalAfterCoupon) : currency(total)}</div>
            </div>

            <button type="submit" form="checkout-form" className="btn btn-primary-500 text-white w-100">
              完成付款
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
