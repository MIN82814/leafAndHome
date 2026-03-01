import { Outlet, NavLink, useOutletContext } from "react-router";
import Footer from "./Footer";
import mark from "/mark.svg";
import cart from "/cart.svg";
import personal from "/personal.svg";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAsyncGetCart } from "../slice/cartSlice";
import * as bootstrap from "bootstrap"; //引入 Bootstrap

function Layout() {
  const { isAuth, setIsAuth } = useOutletContext();
  const carts = useSelector((state) => state.cart.carts);
  const dispatch = useDispatch();

  /* Collapse   */
  // const collapseElRef = useRef(null);
  // const instanceRef = useRef(null);
  // useEffect(() => {
  //   instanceRef.current = new bootstrap.Collapse(collapseElRef.current, {
  //     toggle: false, // 不要初始化就切換
  //   });
  //   return () => {
  //     instanceRef.current?.dispose();
  //   };
  // }, []);

  // const handleToggle = () => {
  //   instanceRef.current?.toggle();
  // };

  useEffect(() => {
    dispatch(createAsyncGetCart());
  }, [dispatch]);

  return (
    <>
      <header>
        <div className="container">
          <div className="d-flex justify-content-between py-4  align-items-center">
            {/* LOGO  */}
            <NavLink to="" className="h3 d-flex align-items-center">
              <img src={mark} alt="logo" className="me-2" />
              <span className="text-underline">觀葉森活</span>
            </NavLink>

            {/* NAVLink  */}
            <div className="d-flex gap-6">
              <NavLink to="products" className="px-4 py-2 h6">
                <span className="text-underline">森活選物</span>
              </NavLink>
              <NavLink to="articles" className="px-4 py-2 h6">
                <span className="text-underline">森活日常誌</span>
              </NavLink>
              <NavLink to="about" className="px-4 py-2 h6">
                <span className="text-underline">關於觀葉森活</span>
              </NavLink>
            </div>
            {/*  Cart / Personal  */}
            <div className="d-flex align-items-center">
              <NavLink to="cart" className="me-3 position-relative">
                <div className="cart-container position-relative">
                  <img src={cart} alt="購物車" className="icon-hover rounded-circle p-3" />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger">
                    {carts.length}
                    <span className="visually-hidden">unread messages</span>
                  </span>
                </div>
              </NavLink>
              {!isAuth ? (
                <NavLink
                  to=""
                  className="p-2"
                  onClick={() => {
                    setIsAuth(true);
                  }}>
                  註冊/登入
                </NavLink>
              ) : (
                <NavLink to="personal" className="">
                  <img src={personal} alt="購物車" className="icon-hover p-3 rounded-circle" />
                </NavLink>
              )}
            </div>
            {/* RWD  mobile menu  */}
            {/* <button class="navbar-toggler border-0 shadow-none" type="button" onClick={handleToggle}>
              <span class="material-symbols-outlined fs-1 text-primary-900">menu</span>
            </button>
            <div class="collapse navbar-collapse offset-md-2 offset-lg-3" id="navbarToggler" ref={collapseElRef}>
              <ul class="navbar-nav me-auto mb-2 mb-md-0 text-center">
                <li class="nav-item mb-4 mb-md-0 me-md-3 me-lg-7">
                  <a class="nav-link active" href="/hexo_blog/">
                    <span class="position-relative px-2 py-1">首頁</span>
                  </a>
                </li>
                <li class="nav-item mb-4 mb-md-0 me-md-3 me-lg-7">
                  <a class="nav-link " href="/hexo_blog/blog">
                    <span class="position-relative px-2 py-1">部落格</span>
                  </a>
                </li>
                <li class="nav-item ">
                  <a class="nav-link " href="/hexo_blog/contact">
                    <span class="position-relative px-2 py-1">聯絡我</span>
                  </a>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </header>
      <Outlet context={{ isAuth, setIsAuth }} />
      <Footer />
    </>
  );
}
export default Layout;
