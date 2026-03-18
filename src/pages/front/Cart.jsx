import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
import { useNavigate, useOutletContext } from "react-router";
import { createAsyncAddCart, createAsyncDelAllCart, createAsyncDelCart, createAsyncUpdateCart } from "../../slice/cartSlice";
import useMessage from "../../hooks/useMessage";
import { currency } from "../../utils/filter";
// import { useDebounce } from "react-use";
import * as bootstrap from "bootstrap"; //引入 Bootstrap
import { getProductsApi } from "../../services/product";

export default function Cart() {
  //購物車內容初始由 CartLayout 傳入
  const { carts } = useOutletContext();

  //React-redux
  const dispatch = useDispatch();

  const subtotal = carts.reduce((sum, item) => sum + item.total, 0);
  const shipping = carts.length > 0 ? 120 : 0;
  const total = subtotal + shipping;
  const [couponCode, setCouponCode] = useState(""); // 使用者輸入
  const [couponApplied, setCouponApplied] = useState(false); // 是否成功套用
  const [totalAfterCoupon, setTotalAfterCoupon] = useState(total); // 折扣後金額
  const navigate = useNavigate();
  const { showSuccess, showError } = useMessage();
  // const handleUpdateCart = (id, qty) => {
  //   dispatch(createAsyncAddCart({ id, qty }));
  //   setCartQty(1);
  // };
  const [deleteProduct, setDeleteProduct] = useState({});
  const deleteModalRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [cartAddOnStack, setCartAddOnStack] = useState([]);

  const handleAddCart = (id, qty) => {
    dispatch(createAsyncAddCart({ id, qty }));
  };

  useEffect(() => {
    const getProducts = async (page = 1) => {
      try {
        const response = await getProductsApi(page, "all");
        setProducts(response.data.products);
        setCartAddOnStack(Array(response.data.products.length).fill(1));
      } catch (error) {
        showError(error.response.data.message);
      }
    };
    //設定初始陣列

    deleteModalRef.current = new bootstrap.Modal("#deleteModal", { keyboard: false });

    document.querySelector("#deleteModal").addEventListener("hide.bs.modal", () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
    getProducts();
  }, []);

  // 透過useRef控制 Modal

  const openModal = (product = null) => {
    setDeleteProduct(product);
    deleteModalRef.current.show();
  };

  const closeModal = () => {
    //重設資料
    deleteModalRef.current.hide();
  };

  //移除購物車品項
  const handleRemoveCart = (e, id) => {
    e.preventDefault();
    dispatch(createAsyncDelCart(id));
    closeModal();
  };

  //  //更新購物車數量
  const handleUpdateCart = (cartId, productId, qty = 1) => {
    dispatch(createAsyncUpdateCart({ cartId, productId, qty }));
  };

  const handleDelAllCart = () => {
    dispatch(createAsyncDelAllCart());
    closeModal();
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
      <div className="container mb-5 cart-table">
        <div className="row d-flex justify-content-between">
          <div className="col-lg-9 ">
            <div className="section mb-4">
              <div className="head d-flex justify-content-between py-4 px-6 bg-secondary-100">
                <h4 className="text-secondary-700">購物車</h4>
                <button
                  type="button"
                  className="btn btn-link text-primary-700 fw-bold text-decoration-underline"
                  onClick={() => {
                    openModal();
                  }}
                  disabled={carts.length <= 0 ? "disabled" : ""}>
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
                    {carts.map((item) => {
                      if (!item?.product) return null;
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
                          <td className="align-middle">
                            <div className="qty-input-group">
                              {/* <button className="btn cart_btn" type="button" id="btn-decrease" disabled={item.qty <= 1 ? "disabled" : ""} onClick={() => handleUpdateCart(item.id, item.product_id, item.qty - 1)}>
                                －
                              </button>
                              <input
                                type="number"
                                className="form-control text-center "
                                defaultValue={item.qty}
                                min="1"
                                max="10"
                                id="qtyInput"
                                onChange={(e) => {
                                  handleUpdateCart(item.id, item.product_id, Number(e.target.value));
                                }}
                              />
                              <button className="btn cart_btn" type="button" id="btn-increase" disabled={item.qty >= 10 ? "disabled" : ""} onClick={() => handleUpdateCart(item.id, item.product_id, item.qty + 1)}>
                                ＋
                              </button> */}
                              <select
                                className="form-select text-center"
                                defaultValue={item.qty}
                                onChange={(e) => {
                                  handleUpdateCart(item.id, item.product_id, Number(e.target.value));
                                }}>
                                {Array.from({ length: 10 }, (_, index) => {
                                  const qty = index + 1;
                                  return (
                                    <option key={qty} value={qty}>
                                      {qty}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td className="align-middle total">NT $ {currency(item.total)}</td>
                          <td className="function">
                            {/* <button type="button" className="btn btn-custom-link-dark">
                              加入收藏
                            </button> */}
                            {/* <button type="button" onClick={(e) => handleRemoveCart(e, item.id)} className="btn btn-custom-link-light">
                              刪除
                            </button> */}
                            <button type="button" onClick={() => openModal(item)} className="btn btn-custom-link-light">
                              刪除品項
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/*mobile DOM*/}
                <div className="d-block d-lg-none">
                  {carts.map((item) => {
                    if (!item?.product) return null;
                    return (
                      <div key={item.id} className="cart-card mb-3 p-3 rounded">
                        {/* 操作列 */}
                        <div className="d-flex gap-3 justify-content-end">
                          {/* <button className="btn btn-custom-link-dark">加入收藏</button> */}
                          <button type="button" onClick={(e) => handleRemoveCart(e, item.id)} className="btn btn-custom-link-light">
                            刪除品項
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
                            <div className="titleZh">{item.product.titleZh}</div>
                            <div className="titleEn">{item.product.titleEn}</div>
                          </div>
                        </div>
                        {/* 單價 */}
                        <div className="d-flex justify-content-end mb-2">
                          <span>NT $ {currency(item.product.price)}</span>
                        </div>
                        {/* 數量 */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="qty-input-group">
                            <button
                              type="button"
                              className="btn"
                              onClick={() => {
                                if (item.qty > 1) {
                                  handleUpdateCart(item.id, item.product_id, item.qty - 1);
                                }
                              }}>
                              －
                            </button>
                            <input
                              type="number"
                              className="form-control text-center"
                              defaultValue={item.qty}
                              min="1"
                              max="10"
                              onChange={(e) => {
                                handleUpdateCart(item.id, item.product_id, Number(e.target.value));
                              }}
                            />
                            <button
                              type="button"
                              className="btn"
                              onClick={() => {
                                handleUpdateCart(item.id, item.product_id, item.qty + 1);
                              }}>
                              ＋
                            </button>
                          </div>
                          {/* 總價 */}
                          <div className="d-flex justify-content-between fw-bold">
                            <span>NT $ {currency(item.total)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* <div className="section mb-4">
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
                            src="/leafAndHome/pot.png"
                            style={{
                              height: "100px",
                              width: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="d-flex flex-column">
                            <span className="titleZh">到貨換盆</span>
                            <span className="titleEn">專業換盆服務，含優質培養土</span>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle price"></td>
                      <td className="align-middle">
                        <div className="qty-input-group">
                          <button className="btn " type="button" id="btn-decrease">
                            －
                          </button>
                          <input type="number" className="form-control text-center " defaultValue="1" min="1" id="qtyInput" />
                          <button className="btn" type="button" id="btn-increase">
                            ＋
                          </button>
                        </div>
                      </td>
                      <td className="align-middle total">NT $ 150 </td>
                      <td className="function">
                        <button type="button" className="btn btn-primary-500 text-white">
                          加入
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "400px" }}>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src="/leafAndHome/wrap.png"
                            style={{
                              height: "100px",
                              width: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="d-flex flex-column">
                            <span className="titleZh">送禮包裝</span>
                            <span className="titleEn">精美禮盒包裝，附手寫卡片</span>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle price"></td>
                      <td className="align-middle">
                        <div className="qty-input-group">
                          <button className="btn " type="button" id="btn-decrease">
                            －
                          </button>
                          <input type="number" className="form-control text-center " defaultValue="1" min="1" id="qtyInput" />
                          <button className="btn" type="button" id="btn-increase">
                            ＋
                          </button>
                        </div>
                      </td>
                      <td className="align-middle total">NT $ 80 </td>
                      <td className="function">
                        <button type="button" className="btn btn-primary-500 text-white">
                          加入
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "400px" }}>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src="/leafAndHome/newbbie.png"
                            style={{
                              height: "100px",
                              width: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="d-flex flex-column">
                            <span className="titleZh">新手照護卡</span>
                            <span className="titleEn">專屬照護指南，隨貨附贈</span>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle price"></td>
                      <td className="align-middle">
                        <div className="qty-input-group">
                          <button className="btn " type="button" id="btn-decrease">
                            －
                          </button>
                          <input type="number" className="form-control text-center " defaultValue="1" min="1" id="qtyInput" />
                          <button className="btn" type="button" id="btn-increase">
                            ＋
                          </button>
                        </div>
                      </td>
                      <td className="align-middle total">免費</td>
                      <td className="function">
                        <button type="button" className="btn btn-primary-500 text-white">
                          加入
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="d-block d-lg-none">
                  <div className="addon-card rounded border p-3 mb-3 bg-white">
                    <div className="d-flex gap-3 mb-3">
                      <img
                        src="/leafAndHome/pot.png"
                        style={{
                          width: "64px",
                          height: "64px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />

                      <div>
                        <div className="titleZh">到貨換盆</div>
                        <div className="titleEn">專業換盆服務，含優質培養土</div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="qty-input-group">
                        <button type="button" className="btn">
                          －
                        </button>

                        <input type="number" className="form-control text-center" defaultValue="1" min="1" />

                        <button type="button" className="btn">
                          ＋
                        </button>
                      </div>

                      <div className="fw-bold">NT $ 150</div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button type="button" className="btn btn-primary-500 text-white">
                        加入
                      </button>
                    </div>
                  </div>
                  <div className="addon-card border rounded p-3 mb-3 bg-white">
                    <div className="d-flex gap-3 mb-3">
                      <img
                        src="/leafAndHome/wrap.png"
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

                        <input type="number" className="form-control text-center" defaultValue="1" min="1" />

                        <button type="button" className="btn">
                          ＋
                        </button>
                      </div>

                      <div className="fw-bold">NT $ 80</div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button type="button" className="btn btn-primary-500 text-white">
                        加入
                      </button>
                    </div>
                  </div>
                  <div className="addon-card border rounded p-3 mb-3 bg-white">
                    <div className="d-flex gap-3 mb-3">
                      <img
                        src="/leafAndHome/newbbie.png"
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

                        <input type="number" className="form-control text-center" defaultValue="1" min="1" />

                        <button type="button" className="btn">
                          ＋
                        </button>
                      </div>

                      <div className="fw-bold">免費</div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button type="button" className="btn btn-primary-500 text-white">
                        加入
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="section mb-4">
              <div className="d-flex justify-content-between bg-secondary-100">
                <div className="head d-flex gap-3 justify-content-start align-items-center py-4 px-6 bg-secondary-100">
                  <h4 className="text-secondary-700">收藏清單</h4>
                  <span className="subHeading">那些您曾停下來看過的植物</span>
                </div>
                {/* <button type="button" className="btn btn-link text-primary-700 fw-bold text-decoration-underline">
                  查看全部
                </button> */}
              </div>
              {products.length >= 1 ? (
                <>
                  <div className="p-4 bg-white">
                    <table className="table cart-table table-hover d-none d-lg-table">
                      <tbody>
                        {products.map((product, index) => (
                          <tr key={`productDesktop-${index}`}>
                            <td style={{ width: "400px" }}>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={product.imageUrl}
                                  style={{
                                    height: "100px",
                                    width: "100px",
                                    objectFit: "cover",
                                  }}
                                  alt={product.title}
                                />
                                <div className="d-flex flex-column">
                                  <span className="titleZh">{product.title}</span>
                                  <span className="titleEn">{product.titleEn}</span>
                                </div>
                              </div>
                            </td>
                            <td className="align-middle price"></td>
                            <td className="align-middle">
                              <div className="qty-input-group">
                                <button className="btn cart_btn" type="button" id="btn-decrease" onClick={() => setCartAddOnStack((pre) => pre.map((item, i) => (i === index ? item - 1 : item)))} disabled={cartAddOnStack[index] <= 1}>
                                  －
                                </button>
                                <input type="number" className="form-control text-center" value={cartAddOnStack[index]} min="1" max="10" id="qtyInput" />
                                <button className="btn cart_btn" type="button" id="btn-increase" onClick={() => setCartAddOnStack((pre) => pre.map((item, i) => (i === index ? item + 1 : item)))} disabled={cartAddOnStack[index] >= 10}>
                                  ＋
                                </button>
                              </div>
                            </td>
                            <td className="align-middle total">NT $ {currency(product.price)}</td>
                            <td className="function">
                              <button
                                type="button"
                                className="btn btn-primary-500 text-white"
                                onClick={() => {
                                  //處理加入購物車
                                  handleAddCart(products[index].id, cartAddOnStack[index]);
                                  //重設為1
                                  setCartAddOnStack((pre) => pre.map((item, i) => (i === index ? 1 : item)));
                                  //畫面回到最上方讓使用者確認購物車品項
                                  window.scrollTo(0, 0);
                                }}>
                                加入
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Mobile Product DOM */}
                    <div className="d-block d-lg-none">
                      {products.map((product, index) => (
                        <div className="addon-card border rounded p-3 mb-3 bg-white" key={`productMobile-${index}`}>
                          {/* 上：商品資訊 */}
                          <div className="d-flex gap-3 mb-3">
                            <img
                              src={product.imageUrl}
                              style={{
                                width: "64px",
                                height: "64px",
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                              alt={product.title}
                            />
                            <div>
                              <div className="titleZh">{product.title}</div>
                              <div className="titleEn">{product.titleEn}</div>
                            </div>
                          </div>

                          {/* 中：qty + price */}
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="qty-input-group d-flex align-items-center">
                              <button type="button" className="btn">
                                －
                              </button>

                              <input type="number" className="form-control text-center" defaultValue="1" min="1" style={{ width: "50px" }} />

                              <button type="button" className="btn">
                                ＋
                              </button>
                            </div>

                            <div className="fw-bold">NT $ {currency(product.price)}</div>
                          </div>

                          {/* 下：CTA */}
                          <div className="d-flex justify-content-end">
                            <button type="button" className="btn btn-primary-500 text-white">
                              加入
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          {/* 右側選單 */}
          <div className="col-lg-3">
            <div className="card position-sticky shadow section" style={{ top: "16px" }}>
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
                <button
                  type="button"
                  onClick={() =>
                    navigate("checkout", {
                      state: { couponApplied, couponCode, totalAfterCoupon },
                    })
                  }
                  className="btn btn-primary-500 w-100 text-white mb-6"
                  disabled={carts.length <= 0 ? "disabled" : ""}>
                  繼續結帳
                </button>
                <div className="d-flex flex-column ">
                  <div className="d-flex justify-content-start gap-2 mb-2">
                    <div className="p-3 rounded-circle bg-background-200 lh-1">
                      <span className="material-symbols-outlined text-secondary-500 lh-1" style={{ fontSize: "24px" }}>
                        security
                      </span>
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <span className="card-text text-neutral-900" style={{ fontSize: "16px" }}>
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

      {/* 手機版置底結帳 */}
      <div className="mobile-checkout-bar d-md-none">
        <div className="d-flex flex-column justify-content-between align-items-start px-4 py-3 bg-white shadow-lg">
          <div className=" w-100 d-flex justify-content-between align-items-center mb-4">
            <div className="text-neutral-700 fw-bold fs-6">總付款金額</div>
            <div className="fw-bold text-neutral-900 fs-4">${couponApplied ? currency(totalAfterCoupon) : currency(total)}</div>
          </div>

          <button
            type="button"
            className="btn btn-primary-500 w-100 text-white fs-5 px-4"
            onClick={() =>
              navigate("checkout", {
                state: { couponApplied, couponCode, totalAfterCoupon },
              })
            }
            disabled={carts.length <= 0 ? "disabled" : ""}>
            繼續結帳
          </button>
        </div>
      </div>
      {/* 刪除用 Modal  */}
      {deleteProduct ? (
        <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger">
                <h2 className="modal-title fs-5 text-white" id="exampleModalLabel">
                  刪除確認
                </h2>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => closeModal()}></button>
              </div>
              <div className="modal-body h6 text-neutral-900">確定要將品項"{deleteProduct?.product?.title}"移出購物車嗎? </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-primary-500" data-bs-dismiss="modal" onClick={() => closeModal()}>
                  取消
                </button>
                <button type="button" className="btn btn-danger" onClick={(e) => handleRemoveCart(e, deleteProduct.id)}>
                  確定
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header  bg-danger">
                <h2 className="modal-title fs-5  text-white" id="exampleModalLabel">
                  刪除確認
                </h2>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => closeModal()}></button>
              </div>
              <div className="modal-body  h6 text-neutral-900">確定要清空購物車內容嗎？</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-primary-500" data-bs-dismiss="modal" onClick={() => closeModal()}>
                  取消
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleDelAllCart()}>
                  確定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
