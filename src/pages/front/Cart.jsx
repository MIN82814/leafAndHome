import axios from "axios";
import { useEffect, useState } from "react";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
import { useNavigate } from "react-router";

export default function Cart() {
  const [cartData, setCartData] = useState([]);
  const subtotal = cartData.reduce((sum, item) => sum + item.total, 0);
  const shipping = cartData.length > 0 ? 120 : 0;
  const total = subtotal + shipping;
  const [couponCode, setCouponCode] = useState(""); // 使用者輸入
  const [couponApplied, setCouponApplied] = useState(false); // 是否成功套用
  const [totalAfterCoupon, setTotalAfterCoupon] = useState(total); // 折扣後金額
  const navigate = useNavigate();

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
        <div className="row d-flex justify-content-between">
          <div className="col-12 col-lg-9 ">
            <div className="section mb-4">
              <div className="head d-flex justify-content-between py-4 px-6 bg-secondary-100">
                <h4 className="text-secondary-700">購物車</h4>
                <button
                  type="button"
                  onClick={() => deleteCarts()}
                  className="btn btn-link text-primary-700 fw-bold text-decoration-underline"
                >
                  全部刪除
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
                      <th scope="col">操作</th>
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
                          <td className="align-middle">
                            <div className="qty-input-group">
                              <button
                                className="btn "
                                type="button"
                                id="btn-decrease"
                                onClick={() => {
                                  if (item.qty > 1) {
                                    updateCartItemQty(item.id, item.qty - 1);
                                  }
                                }}
                              >
                                －
                              </button>
                              <input
                                type="number"
                                className="form-control text-center "
                                value={item.qty}
                                min="1"
                                id="qtyInput"
                                onChange={(e) => {
                                  let val = parseInt(e.target.value);
                                  if (isNaN(val) || val < 1) val = 1;
                                  updateCartItemQty(item.id, val);
                                }}
                              />
                              <button
                                className="btn"
                                type="button"
                                id="btn-increase"
                                onClick={() =>
                                  updateCartItemQty(item.id, item.qty + 1)
                                }
                              >
                                ＋
                              </button>
                            </div>
                          </td>
                          <td className="align-middle total">
                            NT $ {item.total}
                          </td>
                          <td className="function">
                            <button
                              type="button"
                              className="btn btn-custom-link-dark"
                            >
                              加入收藏
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteCart(item.id)}
                              className="btn btn-custom-link-light"
                            >
                              刪除
                            </button>
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
                      <div key={item.id} className="cart-card mb-3 p-3 rounded">
                        {/* 操作列 */}
                        <div className="d-flex gap-3 justify-content-end">
                          <button className="btn btn-custom-link-dark">
                            加入收藏
                          </button>
                          <button
                            onClick={() => deleteCart(item.id)}
                            className="btn btn-custom-link-light"
                          >
                            刪除
                          </button>
                        </div>

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
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="qty-input-group">
                            <button
                              className="btn"
                              onClick={() => {
                                if (item.qty > 1) {
                                  updateCartItemQty(item.id, item.qty - 1);
                                }
                              }}
                            >
                              －
                            </button>

                            <input
                              type="number"
                              className="form-control text-center"
                              value={item.qty}
                              min="1"
                              onChange={(e) => {
                                let val = parseInt(e.target.value);
                                if (isNaN(val) || val < 1) val = 1;
                                updateCartItemQty(item.id, val);
                              }}
                            />

                            <button
                              className="btn"
                              onClick={() =>
                                updateCartItemQty(item.id, item.qty + 1)
                              }
                            >
                              ＋
                            </button>
                          </div>
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
            <div className="section mb-4">
              <div className="head d-flex gap-3 justify-content-start align-items-center py-4 px-6 bg-secondary-100">
                <h4 className="text-secondary-700">加購服務</h4>
                <span className="subHeading">常一起選購的加購服務</span>
              </div>
              <div className="p-4 bg-white">
                <table className="table cart-table table-hover d-none d-lg-table">
                  <tbody>
                    <tr>
                      <td style={{ width: "400px" }}>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
                            style={{
                              height: "100px",
                              width: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="d-flex flex-column">
                            <span className="titleZh">到貨換盆</span>
                            <span className="titleEn">
                              專業換盆服務，含優質培養土
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle price"></td>
                      <td className="align-middle">
                        <div className="qty-input-group">
                          <button
                            className="btn "
                            type="button"
                            id="btn-decrease"
                          >
                            －
                          </button>
                          <input
                            type="number"
                            className="form-control text-center "
                            defaultValue="1"
                            min="1"
                            id="qtyInput"
                          />
                          <button
                            className="btn"
                            type="button"
                            id="btn-increase"
                          >
                            ＋
                          </button>
                        </div>
                      </td>
                      <td className="align-middle total">NT $ 150 </td>
                      <td className="function">
                        <button
                          type="button"
                          className="btn btn-primary-500 text-white"
                        >
                          加入
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "400px" }}>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
                            style={{
                              height: "100px",
                              width: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="d-flex flex-column">
                            <span className="titleZh">送禮包裝</span>
                            <span className="titleEn">
                              精美禮盒包裝，附手寫卡片
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle price"></td>
                      <td className="align-middle">
                        <div className="qty-input-group">
                          <button
                            className="btn "
                            type="button"
                            id="btn-decrease"
                          >
                            －
                          </button>
                          <input
                            type="number"
                            className="form-control text-center "
                            defaultValue="1"
                            min="1"
                            id="qtyInput"
                          />
                          <button
                            className="btn"
                            type="button"
                            id="btn-increase"
                          >
                            ＋
                          </button>
                        </div>
                      </td>
                      <td className="align-middle total">NT $ 80 </td>
                      <td className="function">
                        <button
                          type="button"
                          className="btn btn-primary-500 text-white"
                        >
                          加入
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "400px" }}>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
                            style={{
                              height: "100px",
                              width: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="d-flex flex-column">
                            <span className="titleZh">新手照護卡</span>
                            <span className="titleEn">
                              專屬照護指南，隨貨附贈
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle price"></td>
                      <td className="align-middle">
                        <div className="qty-input-group">
                          <button
                            className="btn "
                            type="button"
                            id="btn-decrease"
                          >
                            －
                          </button>
                          <input
                            type="number"
                            className="form-control text-center "
                            defaultValue="1"
                            min="1"
                            id="qtyInput"
                          />
                          <button
                            className="btn"
                            type="button"
                            id="btn-increase"
                          >
                            ＋
                          </button>
                        </div>
                      </td>
                      <td className="align-middle total">免費</td>
                      <td className="function">
                        <button
                          type="button"
                          className="btn btn-primary-500 text-white"
                        >
                          加入
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* Mobile Addon DOM */}
                <div className="d-block d-lg-none">
                  {/* 到貨換盆 */}
                  <div className="addon-card rounded border p-3 mb-3 bg-white">
                    {/* 上：商品資訊 */}
                    <div className="d-flex gap-3 mb-3">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
                        style={{
                          width: "64px",
                          height: "64px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />

                      <div>
                        <div className="titleZh">到貨換盆</div>
                        <div className="titleEn">
                          專業換盆服務，含優質培養土
                        </div>
                      </div>
                    </div>

                    {/* 中：qty + price */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="qty-input-group">
                        <button type="button" className="btn">
                          －
                        </button>

                        <input
                          type="number"
                          className="form-control text-center"
                          defaultValue="1"
                          min="1"
                        />

                        <button type="button" className="btn">
                          ＋
                        </button>
                      </div>

                      <div className="fw-bold">NT $ 150</div>
                    </div>

                    {/* 下：CTA */}
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-primary-500 text-white"
                      >
                        加入
                      </button>
                    </div>
                  </div>

                  {/* 送禮包裝 */}
                  <div className="addon-card border rounded p-3 mb-3 bg-white">
                    <div className="d-flex gap-3 mb-3">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
                        style={{
                          width: "64px",
                          height: "64px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />

                      <div>
                        <div className="titleZh">送禮包裝</div>
                        <div className="titleEn">精美禮盒包裝，附手寫卡片</div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="qty-input-group">
                        <button type="button" className="btn">
                          －
                        </button>

                        <input
                          type="number"
                          className="form-control text-center"
                          defaultValue="1"
                          min="1"
                        />

                        <button type="button" className="btn">
                          ＋
                        </button>
                      </div>

                      <div className="fw-bold">NT $ 80</div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-primary-500 text-white"
                      >
                        加入
                      </button>
                    </div>
                  </div>

                  {/* 新手照護卡 */}
                  <div className="addon-card border rounded p-3 mb-3 bg-white">
                    <div className="d-flex gap-3 mb-3">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
                        style={{
                          width: "64px",
                          height: "64px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />

                      <div>
                        <div className="titleZh">新手照護卡</div>
                        <div className="titleEn">專屬照護指南，隨貨附贈</div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="qty-input-group">
                        <button type="button" className="btn">
                          －
                        </button>

                        <input
                          type="number"
                          className="form-control text-center"
                          defaultValue="1"
                          min="1"
                        />

                        <button type="button" className="btn">
                          ＋
                        </button>
                      </div>

                      <div className="fw-bold">免費</div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-primary-500 text-white"
                      >
                        加入
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section mb-4">
              <div className="d-flex justify-content-between bg-secondary-100">
                <div className="head d-flex gap-3 justify-content-start align-items-center py-4 px-6 bg-secondary-100">
                  <h4 className="text-secondary-700">收藏清單</h4>
                  <span className="subHeading">那些您曾停下來看過的植物</span>
                </div>
                <button
                  type="button"
                  className="btn btn-link text-primary-700 fw-bold text-decoration-underline"
                >
                  查看全部
                </button>
              </div>
              <div className="p-4 bg-white">
                <table className="table cart-table table-hover d-none d-lg-table">
                  <tbody>
                    <tr>
                      <td style={{ width: "400px" }}>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
                            style={{
                              height: "100px",
                              width: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="d-flex flex-column">
                            <span className="titleZh">吊蘭</span>
                            <span className="titleEn">Spider Plant</span>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle price"></td>
                      <td className="align-middle">
                        <div className="qty-input-group">
                          <button
                            className="btn "
                            type="button"
                            id="btn-decrease"
                          >
                            －
                          </button>
                          <input
                            type="number"
                            className="form-control text-center "
                            defaultValue="1"
                            min="1"
                            id="qtyInput"
                          />
                          <button
                            className="btn"
                            type="button"
                            id="btn-increase"
                          >
                            ＋
                          </button>
                        </div>
                      </td>
                      <td className="align-middle total">NT $ 340 </td>
                      <td className="function">
                        <button
                          type="button"
                          className="btn btn-primary-500 text-white"
                        >
                          加入
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "400px" }}>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
                            style={{
                              height: "100px",
                              width: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="d-flex flex-column">
                            <span className="titleZh">波士頓蕨</span>
                            <span className="titleEn">Boston Fern</span>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle price"></td>
                      <td className="align-middle">
                        <div className="qty-input-group">
                          <button
                            className="btn "
                            type="button"
                            id="btn-decrease"
                          >
                            －
                          </button>
                          <input
                            type="number"
                            className="form-control text-center "
                            defaultValue="1"
                            min="1"
                            id="qtyInput"
                          />
                          <button
                            className="btn"
                            type="button"
                            id="btn-increase"
                          >
                            ＋
                          </button>
                        </div>
                      </td>
                      <td className="align-middle total">NT $ 350</td>
                      <td className="function">
                        <button
                          type="button"
                          className="btn btn-primary-500 text-white"
                        >
                          加入
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* Mobile Product DOM */}
                <div className="d-block d-lg-none">
                  {/* 商品卡片 1 */}
                  <div className="addon-card border rounded p-3 mb-3 bg-white">
                    {/* 上：商品資訊 */}
                    <div className="d-flex gap-3 mb-3">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
                        style={{
                          width: "64px",
                          height: "64px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                        alt="吊蘭"
                      />
                      <div>
                        <div className="titleZh">吊蘭</div>
                        <div className="titleEn">Spider Plant</div>
                      </div>
                    </div>

                    {/* 中：qty + price */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="qty-input-group d-flex align-items-center">
                        <button type="button" className="btn">
                          －
                        </button>

                        <input
                          type="number"
                          className="form-control text-center"
                          defaultValue="1"
                          min="1"
                          style={{ width: "50px" }}
                        />

                        <button type="button" className="btn">
                          ＋
                        </button>
                      </div>

                      <div className="fw-bold">NT $ 340</div>
                    </div>

                    {/* 下：CTA */}
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-primary-500 text-white"
                      >
                        加入
                      </button>
                    </div>
                  </div>

                  {/* 商品卡片 2 */}
                  <div className="addon-card border rounded p-3 mb-3 bg-white">
                    <div className="d-flex gap-3 mb-3">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s"
                        style={{
                          width: "64px",
                          height: "64px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                        alt="波士頓蕨"
                      />
                      <div>
                        <div className="titleZh">波士頓蕨</div>
                        <div className="titleEn">Boston Fern</div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="qty-input-group d-flex align-items-center">
                        <button type="button" className="btn">
                          －
                        </button>

                        <input
                          type="number"
                          className="form-control text-center"
                          defaultValue="1"
                          min="1"
                          style={{ width: "50px" }}
                        />

                        <button type="button" className="btn">
                          ＋
                        </button>
                      </div>

                      <div className="fw-bold">NT $ 350</div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-primary-500 text-white"
                      >
                        加入
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3">
            <div
              className="card position-sticky shadow section"
              style={{ top: "16px" }}
            >
              <div className="card-head bg-primary-700 px-6 py-4">
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
                  type="button"
                  onClick={() =>
                    navigate("checkout", {
                      state: { couponApplied, couponCode, totalAfterCoupon },
                    })
                  }
                  className="btn btn-primary-500 w-100 text-white mb-6"
                >
                  繼續結帳
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
      </div>
    </>
  );
}
