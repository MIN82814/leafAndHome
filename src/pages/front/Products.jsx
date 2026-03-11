import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { getProductsApi } from "../../services/product";
import Pagination from "../../component/adminPagination";
import Card_product from "../../component/Card_product";
import Loading from "../../component/Loading";

function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //分頁
  const [pagination, setPagination] = useState({});

  const getProducts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getProductsApi(page, "all");
      console.log(response.data.products);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.log(error.response);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await getProducts();
    })(); //確認正確後取得產品列表內容
  }, []);

  if (isLoading) {
    return <Loading text={"正在為您搬運植物..."} />;
  }

  return (
    <>
      <div className="bg-neutral-100 py-10">
        <div className="container">
          <div className="row">
            {/* 不用手動return */}
            {products.map((item) => (
              <div className="col-md-4 mb-6" key={item.id}>
                <Card_product product={item} />
                {/* <div className="card">
                <img src={item.imageUrl} className="card-img-top" alt={item.title} />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text">價格: {item.price}</p>
                  <p className="card-text">
                    <small className="text-body-secondary">{item.unit}</small>
                  </p>
                  <NavLink className="btn btn-primary" to={`/products/${item.id}`}>
                    查看更多
                  </NavLink>
                </div>
              </div> */}
              </div>
            ))}
          </div>
          <Pagination pagination={pagination} onChangePage={getProducts} />
        </div>
      </div>
    </>
  );
}

export default Products;
