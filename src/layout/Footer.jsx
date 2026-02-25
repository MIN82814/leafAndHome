import mark from "/mark-w.svg";
import { NavLink } from "react-router";

function Footer() {
  return (
    <div className="bg-primary-500 py-12">
      <div className="container">
        <div className="row row-cols-1 row-cols-lg-2 text-white">
          <div className="col pe-15 mb-9 mb-lg-12">
            <NavLink to="" className="h3 d-flex align-items-center mb-3">
              <img src={mark} alt="logo" className="me-2" />
              <span className="text-underline">觀葉森活</span>
            </NavLink>
            <p className="text-secondary-100">讓養植物這件事，不只是「買一盆回家」，而是一步一步，把生活慢慢長成你喜歡的樣子，為城市生活打造的綠色角落，簡單、安心、有質感。</p>
          </div>
          <div className="col">
            <div className="d-flex gap-6">
              <NavLink to="products" className="px-4 py-2 h6">
                <span className="text-underline">森活選物</span>
              </NavLink>
              <NavLink to="articles" className="px-4 py-2 h6">
                <span className="text-underline">森活日常誌</span>
              </NavLink>
              <NavLink to="about" className="px-4 py-2 h6">
                <span className="text-underline">關於觀葉森活</span>
              </NavLink>
            </div>
          </div>
        </div>
        <p className="text-center text-secondary-300">&copy; 2025觀葉森活 Plant Life. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
