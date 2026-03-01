import { useOutletContext } from "react-router";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import * as bootstrap from "bootstrap";

function Order() {
  const { token, API_BASE, API_PATH } = useOutletContext();

  const formatUnixTime = (unixTime) => {
    const date = new Date(unixTime * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${year}/${month}/${day} ${hour}:${min}`;
  };
  // 訂單列表
  const [orderList, setOrderList] = useState([]);
  const [tempOrder, setTempOrder] = useState({});
  const [tempOrderProducts, setTempOrderProducts] = useState({});


  const orderModalRef = useRef(null);

  
  const openModal = () => {
    orderModalRef.current.show();
  };

  const closeModal = () => {
    orderModalRef.current.hide();
  };

  // 取得訂單列表api
    const getOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/orders`);
        // console.log(res);
        setOrderList(res.data.orders);
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    if (!token) return;
    axios.defaults.headers.common["Authorization"] = token;
    getOrders();

    // 訂單細節modal
    orderModalRef.current = new bootstrap.Modal("#orderModal", {
      keyboard: false,
    });
  }, [token, API_BASE, API_PATH]);

  // 刪除一筆訂單api
  const delOrder = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/api/${API_PATH}/admin/order/${id}`)
      console.log(res);
      getOrders();
    }catch (error) {
      console.log(error);
    };

  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="h2 text-center">訂單列表</h2>
            <div className="text-end mt-4">
              
            </div>

            <table className="table">
              <thead className="table-dark">
                <tr className="table-primary text-center">
                  <th>訂單編號</th>
                  <th>聯絡人</th>
                  <th>聯絡地址</th>
                  <th>電子郵件</th>
                  <th>總金額</th>
                  <th>留言</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {orderList.map((item) => {
                  return (
                    <tr key={item.id} className="text-center">
                      <td>{item.id}</td>
                      <td>{item.user.name}</td>
                      <td>{item.user.address}</td>
                      <td>{item.user.email}</td>
                      <td>{item.total}</td>
                      <td>{item.message}</td>
                      <td>
                        <div className="btn-group">
                          <a
                            className="btn btn-primary active btn-sm"
                            aria-current="page"
                            onClick={()=> {openModal(); setTempOrder(item);setTempOrderProducts(item.products);console.log(tempOrderProducts)}}
                          >
                            訂單內容
                          </a>
                          <a className="btn btn-primary btn-sm" onClick={() => delOrder(item.id)}>刪除</a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="orderModal"
        tabIndex="-1"
        aria-labelledby="orderModalLabel"
        aria-hidden="true"
        ref={orderModalRef}
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="orderModalLabel">
                訂單內容
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>

            <div className="modal-body">
              <section className="mb-4">
                <div className="row g-3">
                  <div className="col-md-3">
                    <small className="text-dark fs-6">訂單 ID</small>
                  </div>
                  <div className="col-md-3">
                    <small className="text-dark fs-6">建立時間</small>
                  </div>
                  <div className="col-md-3">
                    <small className="text-dark fs-6">付款狀態</small>
                    <p className="mb-0"></p>
                  </div>
                  <div className="col-md-3">
                    <small className="text-dark fs-6">訂單總金額</small>
                  </div>
                </div>
                      <div className="row g-3" key={tempOrder.id}>
                        <div className="col-md-3">
                          <p className="mb-0 fw-semibold">{tempOrder.id}</p>
                        </div>
                        <div className="col-md-3">
                          <p className="mb-0">
                            {formatUnixTime(tempOrder.create_at)}
                          </p>
                        </div>
                        <div className="col-md-3">
                          <p className="mb-0">
                            <span className="badge bg-success">
                              {tempOrder.is_paid ? "已付款" : "未付款"}
                            </span>
                          </p>
                        </div>
                        <div className="col-md-3">
                          <p className="mb-0 fw-bold">${tempOrder.total}</p>
                        </div>
                      </div>
              </section>
                <hr />
              <section>
                <h4 className="fw-bold mb-3">商品明細</h4>

                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>商品名稱</th>
                        <th className="text-center">數量</th>
                        <th className="text-end">單價</th>
                        <th className="text-end">小計</th>
                      </tr>
                    </thead>
                    <tbody>
                      
                            <tr>
                              <td>名稱</td>
                              <td className="text-center">2</td>
                              <td className="text-end">$1,000</td>
                              <td className="text-end">$2,000</td>
                            </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Order;
