import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { getProductsApi } from "../../services/product";
import Pagination from "../../component/Pagination";
import Card_product from "../../component/Cards/Card_product";
import Loading from "../../component/Loading";
import useMessage from "../../hooks/useMessage";

function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //分頁
  const [pagination, setPagination] = useState({});

  const { showError } = useMessage();

  const getProducts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getProductsApi(page, "all");
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      showError(error.response.data.message);
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
