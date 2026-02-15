import { NavLink } from "react-router";

// Place icon
import iconHouse from "/iconHouse.svg";
import iconBed from "/iconBed.svg";
import iconOffice from "/iconOffice.svg";
import iconBalcony from "/iconBalcony.svg";

import Card_place from "../../component/Card_place";
import product from "/product.png";
import Card_product from "../../component/Card_product";
import article from "/article.png";
import Card_article from "../../component/Card_Article";
import Pill from "../../component/Pill";
import Card_list from "../../component/Card_list";
import Title from "../../component/Title";

function Home() {
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
              <img src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770182941006.png" className="d-block w-100" alt="把一點綠，種進你的日常森活" />
              <div className="w-100 position-absolute z-1 top-50 start-50 translate-middle d-flex justify-content-center">
                <div className="carousel-text text-center text-white">
                  <h1 className="h1 mb-5">把一點綠，種進你的日常森活</h1>
                  <h4 className="h4">依照光線、空間與好養程度精選觀葉植物，</h4>
                  <h4 className="h4 mb-9">從租屋小套房到辦公桌，一起長出屬於你的綠意角落。</h4>
                  <NavLink to="/products" className="btn btn-neutral-100">
                    逛逛森活選物
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="d-flex justify-content-between bg-neutral-100">
                <img src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770182996909.png" className="carousel-flex-image" alt="..." />
                <img src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770183024147.png" className="carousel-flex-image" alt="..." />
                <img src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770183041746.png" className="carousel-flex-image" alt="..." />
              </div>
            </div>
            <div className="carousel-item">
              <img src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770183075608.png" className="d-block w-100" alt="..." />
              <div className="w-100 position-absolute z-1 top-50 start-50 translate-middle d-flex justify-content-center">
                <div className="carousel-text text-center text-white">
                  <h1 className="h1 mb-5">不會養植物也沒關係</h1>
                  <h4 className="h4 mb-9">從每篇森活誌開始就好</h4>
                  <NavLink to="/products" className="btn btn-neutral-100">
                    閱讀最新生活誌
                  </NavLink>
                </div>
              </div>
              <div className="w-25 position-absolute z-1 bottom-0 start-0  d-flex justify-content-center">
                <div className="p-6 text-center rounded-4 bg-blur">
                  <h6 className="h6 mb-5 text-neutral-900">最新生活誌</h6>
                  <p className="fs-7">從每篇森活誌開始就好</p>
                  <p className="fs-7 text-neutral-700">告別植物殺手稱號！嚴選出5種容錯率最高、最耐操、最適合新手的品種。</p>
                </div>
              </div>
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
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-6">
            <div className="col">
              <Card_place image="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770689650010.jpg" title="租屋小套房" content="小空間也能綠意盎然" icon={iconHouse} kind="6" />
            </div>
            <div className="col">
              <Card_place image="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770689691671.jpg" title="辦公桌增綠" content="工作環境更舒心" icon={iconOffice} kind="11" />
            </div>
            <div className="col">
              <Card_place image="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770689720473.jpg" title="臥室療癒角" content="助眠淨化好夥伴" icon={iconBed} kind="8" />
            </div>
            <div className="col">
              <Card_place image="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770689734990.jpg" title="陽台小花園" content="戶外綠化好選擇" icon={iconBalcony} kind="5" />
            </div>
          </div>
        </div>
      </section>
      <section className="py-11 py-md-14 bg-neutral-200">
        <div className="container">
          <div className="text-center mb-6 mb-md-13">
            <Title title="最適合新手的植物清單" />
            <div className="mt-6">
              <p className="h6 text-neutral-700">我們根據新手最常見的需求，先幫你整理幾組『不容易失敗』的推薦清單</p>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-lg-2 row-cols-xxl-3">
            <div className="col">
              <Card_list title="幾乎沒日照也能活" subTitle="適合幾乎沒日照空間的植物 TOP 5" tag="耐陰好養" color="secondary-500" />
            </div>
            <div className="col">
              <Card_list title="常常忘記澆水也沒關係" subTitle="最不怕你忘記澆水的植物 Top 5" tag="懶人植物" color="primary-700" />
            </div>
            <div className="col">
              <Card_list title="桌上只放得下一點點綠" subTitle="小桌面也放得下的迷你植栽 Top 5" tag="迷你盆栽" color="neutral-700" />
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
            <div className="row row-cols-1 row-cols-md-4 g-6 mb-12">
              <div className="cols">
                <Card_product product={product} />
              </div>
              <div className="cols">
                <Card_product product={product} />
              </div>
              <div className="cols">
                <Card_product product={product} />
              </div>
              <div className="cols">
                <Card_product product={product} />
              </div>
            </div>
          </div>
          <div>
            <h4 className="h4">本月熱銷排行</h4>
            <p className="mb-6">這些是本月最常被帶回家的植物，不太需要猶豫的選擇。</p>
            <div className="row  row-cols-1 row-cols-md-4 g-6 mb-12">
              <div className="cols">
                <Card_product product={product} />
              </div>
              <div className="cols">
                <Card_product product={product} />
              </div>
              <div className="cols">
                <Card_product product={product} />
              </div>
              <div className="cols">
                <Card_product product={product} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-14 bg-neutral-200">
        <div className="container">
          <div className="text-center mb-6 mb-md-13">
            <Title title="森活誌精選" />
          </div>
          <div className="d-flex gap-9">
            <div className="articlr-left">
              <Card_article article={article} size="" />
            </div>
            <div className="article-right d-none d-md-block">
              <div className="mb-9">
                <Card_article article={article} size="s" />
              </div>
              <Card_article article={article} size="s" />
            </div>
          </div>
        </div>
      </section>
      <section className="py-14 bg-neutral-100">
        <div className="container">
          <div className="px-14 py-3">
            <div className="d-flex  flex-wrap  flex-lg-nowrap justify-content-center row-gap-8 column-gap-14">
              <img src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770040902658.png" className="phone" alt="儀表板" />
              <div className="d-flex flex-column pt-3 pb-5">
                <div>
                  <h2 className="h2 mb-3">別忘了你的森活儀表板</h2>
                  <h4 className="h4 text-neutral-700">澆水、施肥、換盆日通通幫你記好，</h4>
                  <h4 className="h4 text-neutral-700 mb-5 mb-md-8">不用再靠記憶就能穩穩養好每一盆植物。</h4>
                  <div className="d-flex flex-wrap row-gap-2 column-gap-4 text-secondary-700">
                    <Pill title="澆水提醒" />
                    <Pill title="澆水提醒" />
                    <Pill title="澆水提醒" />
                    <Pill title="澆水提醒" />
                  </div>
                </div>
                <div className="mt-8 mt-lg-auto d-flex flex-wrap align-items-center">
                  <button type="button" className="btn btn-primary-700 me-lg-5">
                    前往我的森活儀表板
                  </button>
                  <NavLink to="/Personal" className="h6 fw-bold">
                    <span className="text-underline">看看我有哪些植物</span>
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
