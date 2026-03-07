import { Outlet, NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function getCookie() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("hexTokenAPI="))
    ?.split("=")[1];
}

function AdminLayout() {
  const [token, setToken] = useState(getCookie());
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  //登入表單
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  //登入表單處理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  //登入
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexTokenAPI=${token};expires=${new Date(expired)};`;
      setToken(getCookie());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token) {
      //如果未取得token 則跳轉回admin進行登入
      navigate("/admin", { replace: true });
      return;
    }
    if (isAuth) {
      //如果已驗證成功 則不重新驗證
      return;
    }
    //如果取得token 則進行驗證
    const checkLogin = async () => {
      try {
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.post(`${API_BASE}/api/user/check`);
        console.log(response.data);
        setIsAuth(true);
        navigate("products", { replace: true });
      } catch (error) {
        setIsAuth(false);
        console.log(error);
      }
    };
    checkLogin();
  }, [token, navigate, isAuth]);

  return (
    <>
      {!isAuth ? (
        <>
          <div className="container p-4">
            <form onSubmit={(e) => onSubmit(e)}>
              <div className="mb-3">
                <label htmlFor="userName" className="form-label">
                  帳號
                </label>
                <input type="email" name="username" className="form-control" id="userName" aria-describedby="userName" placeholder="email" value={formData.username} onChange={(e) => handleInputChange(e)} />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  密碼
                </label>
                <input type="password" name="password" className="form-control" id="password" placeholder="password" value={formData.password} onChange={(e) => handleInputChange(e)} />
              </div>
              <button type="submit" className="btn btn-primary">
                登入
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          <header>
            <div className="container">
              <div className="d-flex justify-content-between py-4">
                <NavLink to="products" className="px-4 py-2 h6">
                  產品管理
                </NavLink>
                <NavLink to="articles" className="px-4 py-2 h6">
                  文章管理
                </NavLink>
                <NavLink to="coupon" className="px-4 py-2 h6">
                  酷碰管理
                </NavLink>
                <NavLink to="order" className="px-4 py-2 h6">
                  訂單管理
                </NavLink>
                <NavLink to="update" className="px-4 py-2 h6">
                  圖片管理
                </NavLink>
              </div>
            </div>
          </header>
          <Outlet context={{ token, API_BASE, API_PATH }} />
        </>
      )}
    </>
  );
}
export default AdminLayout;
