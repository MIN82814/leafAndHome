import { NavLink, useLocation } from "react-router";
import mark from "/mark.svg";

export default function CartHeader() {
  const location = useLocation();

  const steps = [
    { label: "購物車確認", path: "/cart" },
    { label: "寄送與付款資訊", path: "/cart/checkout" },
    { label: "完成結帳", path: "/cart/order-success" },
  ];

  const getStepClass = (path) => {
    const currentPath = location.pathname;

    // Step3：完成頁 → 自己 active，其餘 completed
    if (currentPath.includes("order-success")) {
      if (path === "/cart/order-success") return "active";
      return "completed";
    }

    // Step2：結帳頁
    if (currentPath.includes("checkout")) {
      if (path === "/cart") return "completed";
      if (path === "/cart/checkout") return "active";
      return "";
    }

    // Step1：購物車頁
    if (currentPath === "/cart") {
      if (path === "/cart") return "active";
      return "";
    }

    return "";
  };

  return (
    <header className="bg-white py-4 cart-header">
      <div className="container d-flex flex-column flex-lg-row justify-content-between  ">
        <div className="d-flex justify-content-start align-items-end py-4">
          <div className="d-flex justify-content-start gap-4">
            <NavLink to="/" className="h3 d-flex align-items-center">
              <img src={mark} alt="logo" className="me-2" />
              <span className="text-underline">觀葉森活</span>
            </NavLink>
            <span className="text-secondary-100" style={{ fontSize: "28px" }}>
              |
            </span>
            <span className="text-neutral-700" style={{ fontSize: "28px" }}>
              購物車
            </span>
          </div>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-3">
          {steps.map((step, index) => (
            <div key={step.path} className="d-flex align-items-center gap-2">
              {/* 圓圈 */}
              <div className={`step-circle ${getStepClass(step.path)}`}>{index + 1}</div>

              {/* 文字 */}
              <span className="text-neutral-700">{step.label}</span>

              {/* 線 */}
              {index !== steps.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
