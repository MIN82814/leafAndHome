import { Outlet, NavLink, useOutletContext } from "react-router";
import { useLocation } from "react-router";
import Footer from "./Footer.jsx";
import CartHeader from "./CartHeader.jsx";

function CartLayout() {
  // const { isAuth, setIsAuth } = useOutletContext();{//暫時沒用到//}
  const location = useLocation();

  // 判斷目前 step
  const getStep = () => {
    if (location.pathname.includes("checkout")) return 2;
    if (location.pathname.includes("order-success")) return 3;
    return 1;
  };

  const step = getStep();

  return (
    <div className="d-flex flex-column min-vh-100 bg-neutral-100">
      <CartHeader />
      <div className="flex-fill">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
export default CartLayout;
