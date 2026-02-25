import { Outlet, NavLink, useOutletContext } from "react-router";
import Footer from "./Footer";
import mark from "/mark.svg";
import cart from "/cart.svg";
import personal from "/personal.svg";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAsyncGetCart } from "../slice/cartSlice";

function Layout() {
  const { isAuth, setIsAuth } = useOutletContext();
  const carts = useSelector((state) => state.cart.carts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createAsyncGetCart());
  }, [dispatch]);

  return (
    <>
      <header>
        <div className="container">
          <div className="d-flex justify-content-between py-4  align-items-center">
            <NavLink to="" className="h3 d-flex align-items-center">
              <img src={mark} alt="logo" className="me-2" />
              <span className="text-underline">觀葉森活</span>
            </NavLink>
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
            <div className="d-flex align-items-center">
              <NavLink to="cart" className="me-3 position-relative">
                <img src={cart} alt="購物車" className="icon-hover rounded-circle p-2" />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger">
                  {carts.length}
                  <span className="visually-hidden">unread messages</span>
                </span>
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
          </div>
        </div>
      </header>
      <Outlet context={{ isAuth, setIsAuth }} />
      <Footer />
    </>
  );
}
export default Layout;
