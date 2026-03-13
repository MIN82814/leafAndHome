import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Title from "../../component/Title";
import { getProductApi } from "../../services/product";
import iconPoint from "/icons/iconPoint.svg";
import iconStar from "/icons/iconStar.svg";
import CareGuide from "../../component/CareGuide";
import Star from "../../component/Star";
import { createAsyncAddCart } from "../../slice/cartSlice";
import { useDispatch } from "react-redux";
import useMessage from "../../hooks/useMessage";
import { currency } from "../../utils/filter";

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [cartQty, setCartQty] = useState(1);
  const dispatch = useDispatch();
  const [targetUrl, setTargetUrl] = useState();

  const { showError } = useMessage();

  const handleAddCart = (id, qty) => {
    dispatch(createAsyncAddCart({ id, qty }));
    setCartQty(1);
  };

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const response = await getProductApi(id);
        setProduct(response.data.product);
        setTargetUrl(response.data.product.imageUrl);
      } catch (error) {
        showError(error.response.data.message);
      }
    };
    getSingleProduct();
  }, [id]);

  //更換主圖為點擊圖片
  const changeTargetUrl = (e) => {
    e.preventDefault();
    setTargetUrl(e.target.src);
  };

  if (!product)
    return (
      <>
        <div className="container">
          <div className="py-11 py-md-14">
            <div className="text-center mb-6 mb-md-13">
              <Title title="查無產品" />
            </div>
          </div>
        </div>
      </>
    );
  return (
    <>
      {/* {JSON.stringify(product)} */}
      <section className="bg-neutral-100 py-11 py-md-14">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row gap-9">
            <div className="d-flex flex-column-reverse  flex-md-row gap-6 product-image-area">
              <div className="d-flex flex-row flex-md-column gap-1 gap-md-3 product-image-selection">
                <a
                  href="#"
                  onClick={(e) => {
                    changeTargetUrl(e);
                  }}>
                  <img src={product.imageUrl} className="rounded-2" alt={product.title} />
                </a>
                {product?.imagesUrl?.map((image, index) => (
                  <a
                    href="#"
                    onClick={(e) => {
                      changeTargetUrl(e);
                    }}
                    key={`image-${index}`}>
                    <img src={image} className="rounded-2" alt={product.title} />
                  </a>
                ))}
              </div>
              <div className="">{targetUrl ? <img src={targetUrl} className="rounded-4" alt={product.title} /> : <></>}</div>
            </div>
            <div className="py-4 d-flex flex-column gap-9 product-content">
              <div className="d-flex flex-column flex-grow-1 justify-content-between">
                <div>
                  <h6 className="h6 text-secondary-700 mb-3">{product.titleEn}</h6>
                  <h2 className="h2 text-neutral-900">{product.title}</h2>
                </div>
                <div>
                  <p className="fs-5 mb-3">✦ 全館滿兩千免運 ✦</p>
                  <h4 className="text-neutral-900 h4">
                    NT$ {currency(product.price)}
                    <span className="text-neutral-500 fw-bold ms-4 fs-7 text-decoration-line-through">NT$ {currency(product.origin_price)}</span>
                  </h4>
                </div>
              </div>

              <div className="w-100">
                <label className="text-neutral-900 h6 mb-2">數量</label>
                <div className="border rounded-3 border-secondary-700 d-flex justify-content-between mb-5">
                  <button className="btn cart_btn fw-bold" type="button" id="button-addon1" aria-label="Decrease quantity" onClick={() => setCartQty((pre) => pre - 1)} disabled={cartQty <= 1}>
                    <i className="bi bi-dash-lg"></i>
                  </button>
                  <input className="form-control bg-neutral-100 text-center fw-bold border-0" type="number" min="1" max="10" value={cartQty} onChange={(e) => setCartQty(Number(e.target.value))} />
                  <button className="btn cart_btn" type="button" id="button-addon2" aria-label="Decrease quantity" onClick={() => setCartQty((pre) => pre + 1)} disabled={cartQty >= 10}>
                    <i className="bi bi-plus-lg "></i>
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-primary-500 text-white w-100"
                  onClick={() => {
                    handleAddCart(id, cartQty);
                  }}>
                  加入購物車
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-secondary-500 py-10">
        <div className="container">
          <div className="row row-cols-2 row-cols-md-4 gy-4">
            <div className="col">
              <div className="d-flex justify-content-center gap-2 gap-md-4 align-items-center">
                <div className="p-2 p-md-4 bg-white rounded-circle">
                  <span className="material-symbols-outlined text-secondary-700 fs-2">package_2</span>
                </div>
                <div>
                  <h4 className="h4 text-background-100">七天到貨</h4>
                  <h6 className="h6 text-secondary-100">新鮮直送</h6>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="d-flex justify-content-center  gap-2 gap-md-4 align-items-center">
                <div className="p-2 p-md-4 bg-white rounded-circle">
                  <span className="material-symbols-outlined text-secondary-700 fs-2">build</span>
                </div>
                <div>
                  <h4 className="h4 text-background-100">破損補寄</h4>
                  <h6 className="h6 text-secondary-100">品質保證</h6>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="d-flex justify-content-center  gap-2 gap-md-4 align-items-center">
                <div className="p-2 p-md-4 bg-white rounded-circle">
                  <span className="material-symbols-outlined text-secondary-700 fs-2">replay</span>
                </div>
                <div>
                  <h4 className="h4 text-background-100">七天鑑賞</h4>
                  <h6 className="h6 text-secondary-100">不滿意可退</h6>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="d-flex justify-content-center  gap-2 gap-md-4 align-items-center">
                <div className="p-2 p-md-4 bg-white rounded-circle">
                  <span className="material-symbols-outlined text-secondary-700 fs-2">support_agent</span>
                </div>
                <div>
                  <h4 className="h4 text-background-100">專業客服</h4>
                  <h6 className="h6 text-secondary-100">照顧諮詢</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-background-200  py-11 py-md-14">
        <div className="container">
          <div className="text-center mb-6 mb-md-13">
            <Title title="照顧指南" />
          </div>
          <div className="row g-6">
            <CareGuide icon="sunny" title="光線需求" subTitle={product?.careGuide?.light} />
            <CareGuide icon="water_drop" title="澆水頻率" subTitle={product?.careGuide?.watering} />
            <CareGuide icon="device_thermostat" title="適合溫度" subTitle={product?.careGuide?.temperature} />
            <CareGuide icon="dew_point" title="濕度需求" subTitle={product?.careGuide?.humidity} />
            <CareGuide icon="straighten" title="尺寸需求" subTitle={product?.careGuide?.size} />
            <CareGuide icon="pets" title="寵物安全" subTitle={product?.careGuide?.petSafety} />
            <CareGuide icon="potted_plant" title="支撐/換盆建議" subTitle={product?.careGuide?.supportRepotting} />
            <CareGuide icon="volunteer_activism" title="照顧難度" subTitle={product?.careGuide?.difficulty} />
          </div>
        </div>
      </section>
      <section className="bg-neutral-100  py-11 py-md-14">
        <div className="container">
          <div className="text-center mb-6 mb-md-13">
            <Title title="詳細介紹" />
          </div>
          <div className="bg-white p-6 rounded-4">
            <div className="row p-6">
              <div className="col-md-6 mb-4 mb-md-0">
                <h4 className="h4">植物特色</h4>
              </div>
              <div className="col-md-6">
                {product?.detailedIntro?.features.map((item, index) => (
                  <p className="mb-2 text-neutral-700 fw-medium" key={`features-${index}`}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="row p-6">
              <div className="col-md-6 mb-4 mb-md-0">
                <h4 className="h4">照顧注意事項</h4>
              </div>
              <div className="col-md-6">
                {product?.detailedIntro?.careNotes.map((item, index) => (
                  <p className="mb-2 text-neutral-700 fw-medium" key={`careNotes-${index}`}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="row p-6">
              <div className="col-md-6 mb-4 mb-md-0">
                <h4 className="h4">為你帶來的好處</h4>
              </div>
              <div className="col-md-6">
                {product?.detailedIntro?.benefits.map((item, index) => (
                  <p className="mb-2 text-neutral-700 fw-medium" key={`benefit-${index}`}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-background-200  py-11 py-md-14">
        <div className="container">
          <div className="text-center mb-6 mb-md-13">
            <Title title="適合擺放情境" />
            <div className="mt-6">
              <p className="h6 text-neutral-700">想像它在你家的樣子，找到最適合的位置</p>
            </div>
          </div>
          <div className="row">
            {product?.placementScenes?.map((scene, index) => (
              <div className="col-md-4" key={`scene-${index}`}>
                <div className="bg-white p-3 pb-4 rounded-4">
                  <div className="position-relative mb-2">
                    <img src={product.imagesUrl[index]} alt={scene.scene} className="rounded-3" />
                    <span className="position-absolute scene-tag  px-4 py-1 bg-white fw-bold rounded-1">{scene.scene}</span>
                  </div>
                  <ul className="d-flex flex-column gap-1 px-2 py-3">
                    {scene?.phrases.map((phrase, pIndex) => (
                      <li className="text-neutral-900 h6 fw-medium" key={`phrase-${pIndex}`}>
                        <img src={iconPoint} alt="point" />
                        <span className="ps-1">{phrase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center"></div>
        </div>
      </section>
      <section className="bg-neutral-100  py-11 py-md-14">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <h2 className="mb-7">顧客評價</h2>
              <div className="d-flex justify-content-between align-items-center d-md-block">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <img src={iconStar} alt="star" style={{ width: "48px" }} />
                  <span className="h2 text-neutral-900">4.8</span>
                </div>
                <p className="text-neutral-700 h5">基於 88 則評價</p>
              </div>
            </div>

            <div className="col-md-9">
              <div className="d-flex  gap-5 mb-4 align-items-center">
                <div>
                  <Star star={5} />
                </div>
                <div className="progress flex-grow-1">
                  <div className="progress-bar bg-primary-500" role="progressbar" style={{ width: "72%" }} aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <span>72</span>
              </div>
              <div className="d-flex  gap-5 mb-4 align-items-center">
                <div>
                  <Star star={4} />
                </div>
                <div className="progress flex-grow-1">
                  <div className="progress-bar bg-primary-500" role="progressbar" style={{ width: "12%" }} aria-valuenow="12" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <span>12</span>
              </div>
              <div className="d-flex  gap-5 mb-4 align-items-center">
                <div>
                  <Star star={3} />
                </div>
                <div className="progress flex-grow-1">
                  <div className="progress-bar bg-primary-500" role="progressbar" style={{ width: "3%" }} aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <span>3</span>
              </div>
              <div className="d-flex  gap-5 mb-4 align-items-center">
                <div>
                  <Star star={2} />
                </div>
                <div className="progress flex-grow-1">
                  <div className="progress-bar bg-primary-500" role="progressbar" style={{ width: "1%" }} aria-valuenow="1" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <span>1</span>
              </div>
              <div className="d-flex  gap-5 mb-4 align-items-center">
                <div>
                  <Star star={1} />
                </div>
                <div className="progress flex-grow-1">
                  <div className="progress-bar bg-primary-500" role="progressbar" style={{ width: "0%" }} aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <span>0</span>
              </div>
            </div>
          </div>
          {product?.customerReviews?.map((review, index) => (
            <div className="py-6" key={`review-${index}`}>
              <h4 className="h4 mb-5">{review.name}</h4>
              <div className="d-flex gap-4 mb-5">
                <div className="d-flex gap-1">
                  {/*  依照數量顯示顯示星數 */}
                  <Star star={review.stars} />
                </div>
                <p> {review.date}</p>
              </div>
              <p className="text-neutral-700 mb-5">{review.comment}</p>
              {review?.keywords?.map((keyword) => (
                <span key={keyword} className="px-3 py-1 border border-primary-700 rounded-3 me-2 fw-bold">
                  {keyword}
                </span>
              ))}
            </div>
          ))}
          <div className="text-center"></div>
        </div>
      </section>
    </>
  );
}

export default Product;
