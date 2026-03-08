import { useOutletContext } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import * as bootstrap from "bootstrap";
import { delAdminOrderApi, getAdminOrdersApi } from "../../services/order";

function Order() {
  const { token } = useOutletContext();

  const formatUnixTime = (unixTime) => {
    if (!unixTime) return "";
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
  const modalInstance = useRef(null);

  const openModal = useCallback((item) => {
    setTempOrder(item);
    setTempOrderProducts(item.products || {});
    if (modalInstance.current) {
      modalInstance.current.show();
    }
  }, []);

  const closeModal = useCallback(() => {
    if (modalInstance.current) {
      modalInstance.current.hide();
    }
  }, []);

  // 取得訂單列表api
  const getOrders = useCallback(async () => {
    try {
      const res = await getAdminOrdersApi();
      setOrderList(res.data.orders || []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // 初始化 Modal
  useEffect(() => {
    if (orderModalRef.current) {
      modalInstance.current = new bootstrap.Modal(orderModalRef.current, {
        keyboard: false,
      });
    }
    return () => {
      if (modalInstance.current) {
        modalInstance.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        await getOrders();
      };
      fetchData();
    }
  }, [token, getOrders]);

  // 刪除一筆訂單api
  const delOrder = async (id) => {
    try {
      await delAdminOrderApi(id);
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="h2 text-center">訂單列表</h2>
            <div className="text-end mt-4"></div>

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
                      <td>{item.user?.name}</td>
                      <td>{item.user?.address}</td>
                      <td>{item.user?.email}</td>
                      <td>{item.total}</td>
                      <td>{item.message}</td>
                      <td>
                        <div className="btn-group">
                          <a
                            className="btn btn-primary active btn-sm"
                            aria-current="page"
                            onClick={() => {
                              openModal(item);
                            }}
                          >
                            訂單內容
                          </a>
                          <a
                            className="btn btn-primary btn-sm"
                            onClick={() => delOrder(item.id)}
                          >
                            刪除
                          </a>
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
                {tempOrder.id ? (
                  <div className="row g-3">
                    <div className="col-md-4">
                      <p className="mb-0 fw-semibold">{tempOrder.id}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="mb-0">
                        {formatUnixTime(tempOrder.create_at)}
                      </p>
                    </div>
                    <div className="col-md-3">
                      <p className="mb-0">
                        <span
                          className={`badge ${tempOrder.is_paid ? "bg-success" : "bg-secondary"}`}
                        >
                          {tempOrder.is_paid ? "已付款" : "未付款"}
                        </span>
                      </p>
                    </div>
                    <div className="col-md-3">
                      <p className="mb-0 fw-bold">
                        ${tempOrder.total?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center">讀取中...</p>
                )}
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
                      {tempOrderProducts &&
                        Object.values(tempOrderProducts).map((product) => (
                          <tr key={product.id}>
                            <td>{product.product?.title}</td>
                            <td className="text-center">
                              {product.qty} {product.product?.unit}
                            </td>
                            <td className="text-end">
                              ${product.product?.price?.toLocaleString()}
                            </td>
                            <td className="text-end">
                              ${product.final_total?.toLocaleString()}
                            </td>
                          </tr>
                        ))}
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
