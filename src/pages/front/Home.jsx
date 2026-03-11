import { NavLink } from "react-router";

import Card_place from "../../component/Card_place";
import Card_product from "../../component/Card_product";
import Card_article from "../../component/Card_article";
import Pill from "../../component/Pill";
import Card_list from "../../component/Card_list";
import Title from "../../component/Title";
import { getProductsApi } from "../../services/product";
import { getArticlesApi } from "../../services/article";
import { useEffect, useState } from "react";
import { formatPlainTitle } from "../../utils/articleHelpers";

function Home() {
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [topA, setTopA] = useState([]);
  const [topB, setTopB] = useState([]);
  const [topC, setTopC] = useState([]);
  // const collapseRef = useRef(null);

  useEffect(() => {
    // collapseRef.current = new bootstrap.Collapse(document.querySelector(".collapse"));
    const getProducts = async () => {
      try {
        const response = await getProductsApi(1, "all");
        console.log(response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    const getArticles = async () => {
      try {
        const response = await getArticlesApi(1);
        console.log(response.data.articles);
        setArticles(response.data.articles);
      } catch (error) {
        console.log(error.response);
      }
    };

    getProducts();
    getArticles();
  }, []);

  useEffect(() => {
    //尚未取得資料時先 return
    if (products.length < 1) return;

    //取得資料以後更新 TOP 5
    const setTOP = () => {
      // 設定精選植物項目
      setTopA([products[0], products[1], products[2], products[3], products[4]]);
      setTopB([products[1], products[2], products[4], products[5], products[6]]);
      setTopC([products[3], products[5], products[2], products[4], products[7]]);
    };
    setTOP();
  }, [products]);

  // const closeCollapse = () => {
  //   collapseRef.current.hide();
  // };

  return (
    <>
      <section className="modal-width">
        <div id="carouselExampleIndicators" className="carousel slide">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active position-relative">
              <img src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770182941006.png" className="d-block w-100 img" alt="把一點綠，種進你的日常森活" />
              <div className="w-100 position-absolute z-1 top-50 start-50 translate-middle d-flex justify-content-center">
                <div className="carousel-text text-center text-white">
                  <h1 className="h1 mb-5">把一點綠，種進你的日常森活</h1>
                  <h4 className="h4">依照光線、空間與好養程度精選觀葉植物，</h4>
                  <h4 className="h4 mb-9">從租屋小套房到辦公桌，一起長出屬於你的綠意角落。</h4>
                  <NavLink to="/products" className="btn btn-neutral-100 text-primary-700 px-10 py-4 fs-5 fw-bold">
                    逛逛森活選物
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="carousel-flex d-flex flex-column flex-md-row justify-content-between bg-neutral-100 position-relative">
                <div className="carousel-flex-image-container position-relative">
                  <img src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770182996909.png" alt="玄關植物" className="carousel-flex-image" />
                  <div className="d-none d-md-block  position-absolute carousel-flex-image-text start-50 translate-middle  px-4 py-2 d-flex align-items-center justify-content-center flex-column rounded-circle">
                    <h4 className="text-neutral-900 mb-2 h4">低光</h4>
                    <p className="fs-7 text-neutral-900">適合玄關</p>
                  </div>
                </div>
                <div className="carousel-flex-image-container position-relative">
                  <img src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770183024147.png" className="carousel-flex-image" alt="書桌植物" />
                  <div className="d-none d-md-block position-absolute carousel-flex-image-text start-50 translate-middle  px-4 py-2 d-flex align-items-center justify-content-center flex-column rounded-circle">
                    <h4 className="text-neutral-900 mb-2 h4">中光</h4>
                    <p className="fs-7 text-neutral-900">適合書桌</p>
                  </div>
                </div>
                <div className="carousel-flex-image-container position-relative">
                  <img src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770183041746.png" className="carousel-flex-image" alt="窗邊植物" />
                  <div className="d-none d-md-block position-absolute carousel-flex-image-text start-50 translate-middle  px-4 py-2 d-flex align-items-center justify-content-center flex-column rounded-circle">
                    <h4 className="text-neutral-900 mb-2 h4">高光</h4>
                    <p className="fs-7 text-neutral-900">適合窗邊</p>
                  </div>
                </div>
                <div className="w-100 position-absolute z-1 top-50  start-50 translate-middle d-flex justify-content-center">
                  <div className="carousel-text text-center text-white">
                    <h2 className="h1">為你的空間挑一盆剛剛好的植物</h2>
                    <h4 className="h4 mb-4">給每個角落，一盆剛剛好的綠</h4>
                    <ul className="d-flex gap-3 justify-content-center mb-6 flex-wrap">
                      <li className="bg-secondary-700 px-4 py-2 rounded-pill">依光線條件推薦</li>
                      <li className="bg-secondary-700 px-4 py-2 rounded-pill">新手也養得活</li>
                      <li className="bg-secondary-700 px-4 py-2 rounded-pill">對應坪數與用途</li>
                    </ul>
                    <NavLink to="/products" className="btn btn-neutral-100 text-primary-700 px-10 py-4 fs-5 fw-bold">
                      為我的空間配盆栽植物
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770183075608.png" className="d-block w-100 img" alt="植物景觀圖" />
              <div className="w-100 position-absolute z-1 top-50 start-50 translate-middle d-flex justify-content-center">
                <div className="carousel-text text-center text-white">
                  <h1 className="h1 mb-5">不會養植物也沒關係</h1>
                  <h4 className="h4 mb-9">從每篇森活誌開始就好</h4>
                  <NavLink to="/articles" className="btn btn-neutral-100 text-primary-700 px-10 py-4 fs-5 fw-bold">
                    閱讀最新生活誌
                  </NavLink>
                </div>
              </div>
              {articles[0] ? (
                <div className="carousel-article-text position-absolute z-1  d-flex justify-content-center p-6 rounded-4 bg-blur align-items-center gap-4">
                  <img src={articles[0].image} alt="文章圖片" className="carousel-article-image rounded-3" />
                  <div>
                    <h6 className="h6 text-neutral-900">最新生活誌</h6>
                    <p className="fs-7 mb-3">{formatPlainTitle(articles[0].title)}</p>
                    <p className="d-none d-md-block fs-7 text-neutral-700 truncate-line-2">{formatPlainTitle(articles[0].description)}</p>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="carousel-control-prev-icon icon-hover" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="carousel-control-next-icon icon-hover" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>
      <section className="py-11 py-md-14 bg-neutral-100">
        <div className=" container">
          <div className="text-center mb-6 mb-md-13">
            <Title title="從你的生活場景開始" />
            <div className="mt-6">
              <p className="h6 text-neutral-700">不知道該選什麼植物？告訴我們你想綠化的空間， </p>
              <p className="h6 text-neutral-700">我們為你推薦最適合的植栽方案。</p>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-6 x-hidden">
            <div className="col">
              <Card_place image="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770689650010.jpg" title="租屋小套房" content="小空間也能綠意盎然" icon="home_and_garden" kind="6" />
            </div>
            <div className="col">
              <Card_place image="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770689691671.jpg" title="辦公桌增綠" content="工作環境更舒心" icon="trip" kind="11" />
            </div>
            <div className="col">
              <Card_place image="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770689720473.jpg" title="臥室療癒角" content="助眠淨化好夥伴" icon="bed" kind="8" />
            </div>
            <div className="col">
              <Card_place image="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770689734990.jpg" title="陽台小花園" content="戶外綠化好選擇" icon="deck" kind="5" />
            </div>
          </div>
        </div>
      </section>
      <section className="py-11 py-md-14 bg-background-200">
        <div className="container">
          <div className="text-center mb-6 mb-md-13">
            <Title title="最適合新手的植物清單" />
            <div className="mt-6">
              <p className="h6 text-neutral-700">我們根據新手最常見的需求，先幫你整理幾組『不容易失敗』的推薦清單</p>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-lg-2 row-cols-xxl-3 gy-3">
            <div className="col">
              <Card_list title="幾乎沒日照也能活" subTitle="適合幾乎沒日照空間的植物 TOP 5" tag="耐陰好養" color="secondary-500" products={topA} />
            </div>
            <div className="col">
              <Card_list title="常常忘記澆水也沒關係" subTitle="最不怕你忘記澆水的植物 Top 5" tag="懶人植物" color="primary-700" products={topB} />
            </div>
            <div className="col">
              <Card_list title="桌上只放得下一點點綠" subTitle="小桌面也放得下的迷你植栽 Top 5" tag="迷你盆栽" color="neutral-700" products={topC} />
            </div>
          </div>
        </div>
      </section>
      <section className="py-14 bg-neutral-100 px-6 px-md-10 px-xl-14">
        <h4 className="h4 d-flex align-items-center justify-content-around gap-6 text-secondary-500 mb-12 decoration-line w-100">想單純滑滑看最近的新朋友和人氣款？從這裡開始逛就好。</h4>
        <div className="container">
          <div>
            <h4 className="h4">新品上架</h4>
            <p className="mb-6">本週最新到貨，搶先擁有最美的綠意</p>
            <div className="row row-cols-1  row-cols-md-2 row-cols-lg-4 g-6 mb-12 x-hidden">
              <div className="cols">{products[0] ? <Card_product product={products[0]} /> : <></>}</div>
              <div className="cols">{products[1] ? <Card_product product={products[1]} /> : <></>}</div>
              <div className="cols">{products[2] ? <Card_product product={products[2]} /> : <></>}</div>
              <div className="cols">{products[3] ? <Card_product product={products[3]} /> : <></>}</div>
            </div>
          </div>
          <div>
            <h4 className="h4">本月熱銷排行</h4>
            <p className="mb-6">這些是本月最常被帶回家的植物，不太需要猶豫的選擇。</p>
            <div className="row row-cols-1  row-cols-md-2 row-cols-lg-4 g-6 mb-12 x-hidden">
              <div className="cols">{products[4] ? <Card_product product={products[4]} /> : <></>}</div>
              <div className="cols">{products[5] ? <Card_product product={products[5]} /> : <></>}</div>
              <div className="cols">{products[6] ? <Card_product product={products[6]} /> : <></>}</div>
              <div className="cols">{products[7] ? <Card_product product={products[7]} /> : <></>}</div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-14 bg-background-200">
        <div className="container">
          <div className="text-center mb-6 mb-md-13">
            <Title title="森活誌精選" />
          </div>
          <div className="d-flex gap-9">
            <div className="articlr-left">{articles[0] ? <Card_article article={articles[0]} size="" /> : <></>}</div>
            <div className="article-right d-none d-md-block">
              <div className="mb-9">{articles[1] ? <Card_article article={articles[1]} size="s" /> : <></>}</div>
              {articles[2] ? <Card_article article={articles[2]} size="s" /> : <></>}
            </div>
          </div>
        </div>
      </section>
      <section className="py-14 bg-neutral-100">
        <div className="container">
          <div className="px-md-14 py-3">
            <div className="d-flex  flex-wrap  flex-lg-nowrap justify-content-center row-gap-8 column-gap-14">
              <img src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770040902658.png" className="phone" alt="儀表板" />
              <div className="d-flex flex-column pt-3 pb-5">
                <div>
                  <h2 className="h2 mb-3">別忘了你的森活儀表板</h2>
                  <h4 className="h4 text-neutral-700 mb-5 mb-md-8">
                    澆水、施肥、換盆日通通幫你記好，
                    <br className="d-none d-md-block" />
                    不用再靠記憶就能穩穩養好每一盆植物。
                  </h4>
                  <div className="d-flex flex-wrap row-gap-2 column-gap-4 text-secondary-700">
                    <Pill title="澆水提醒" />
                    <Pill title="換盆與剪葉記錄" />
                    <Pill title="施肥提醒" />
                    <Pill title="每週照顧小報告" />
                  </div>
                </div>
                <div className="mt-8 mt-lg-auto d-flex flex-wrap align-items-center">
                  <NavLink to="/personal" className="btn btn-primary-500 me-lg-5 text-white mb-3 mb-md-0">
                    <i className="bi bi-tablet"></i>
                    前往我的森活儀表板
                  </NavLink>
                  <NavLink to="/personal/my-plants" className="h6 fw-bold">
                    <span className="text-underline">
                      看看我有哪些植物 <i className="bi bi-arrow-right"></i>
                    </span>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
