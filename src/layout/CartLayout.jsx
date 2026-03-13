import { Outlet } from "react-router";
import Footer from "./Footer.jsx";
import CartHeader from "./CartHeader.jsx";
import { createAsyncGetCart } from "../slice/cartSlice";

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

function CartLayout() {
  const carts = useSelector((state) => state.cart.carts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createAsyncGetCart());
  }, [dispatch]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-neutral-100">
      <CartHeader />
      <div className="flex-fill">
        <Outlet context={{ carts }} />
      </div>
      <Footer />
    </div>
  );
}
export default CartLayout;
