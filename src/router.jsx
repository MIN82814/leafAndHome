import { Children } from "react";
// 導覽列
import AuthLayout from "./layout/AuthLayout.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import CartLayout from "./layout/CartLayout.jsx";
import Layout from "./layout/Layout.jsx";

//前台

import Home from "./pages/front/Home.jsx";
import About from "./pages/front/About.jsx";
import Articles from "./pages/front/Articles.jsx";
import Article from "./pages/front/Article.jsx";
import Products from "./pages/front/Products.jsx";
import Product from "./pages/front/Product.jsx";
import Personal from "./pages/front/Personal.jsx";
import Cart from "./pages/front/Cart.jsx";
import Checkout from "./pages/front/Checkout.jsx";
import OrderSuccess from "./pages/front/OrderSuccess.jsx";

//後台
import AdminCoupon from "./pages/admin/Coupon.jsx";
import AdminOrder from "./pages/admin/Order.jsx";
import AdminProducts from "./pages/admin/Products.jsx";
import AdminUpdate from "./pages/admin/Update.jsx";
import AdminArticles from "./pages/admin/Articles.jsx";

const routes = [
  {
    path: "/",
    element: <AuthLayout />, //登入認證
    children: [
      {
        element: <Layout />,
        children: [
          { path: "", element: <Home /> },
          { path: "about", element: <About /> },
          { path: "articles", element: <Articles /> },
          { path: "articles/:id", element: <Article /> },
          { path: "products", element: <Products /> },
          { path: "products/:id", element: <Product /> },
          { path: "personal", element: <Personal /> },
        ],
      },
      {
        path: "cart",
        element: <CartLayout />,
        children: [
          { path: "", element: <Cart /> },
          { path: "checkout", element: <Checkout /> },
          { path: "order-success/:id", element: <OrderSuccess /> },
        ],
      },
    ],
  },
  //後台
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "update", element: <AdminUpdate /> },
      { path: "articles", element: <AdminArticles /> },
      { path: "coupon", element: <AdminCoupon /> },
      { path: "products", element: <AdminProducts /> },
      { path: "order", element: <AdminOrder /> },
    ],
  },
];
export default routes;
