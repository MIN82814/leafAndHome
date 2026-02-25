import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { getProductsApi } from "../../services/product";

function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await getProductsApi(1, "all");
        console.log(response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProducts();
  }, []);
  return (
    <>
      {" "}
      <div className="container">
        <div className="row">
          {/* 不用手動return */}
          {products.map((item) => (
            <div className="col-md-4 mb-3" key={item.id}>
              <div className="card">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Products;
