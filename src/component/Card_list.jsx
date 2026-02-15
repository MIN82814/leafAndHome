import image_plant from "/plant.png";
import Card_hor from "../component/Card_hor";
import { useState } from "react";

function Card_list({ title, subTitle, tag, color }) {
  const [prducts, setProducts] = useState([]);
  const product = {
    image: image_plant,
    title: "虎尾蘭",
    enTitle: "snake plant",
    star: "4.9",
    tag: "超簡單",
  };
  return (
    <div className="card  p-5  cardList">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h4 className="text-neutral-900 h4">{title}</h4>
          <p className="text-neutral-700">{subTitle}</p>
        </div>
        <span className={`d-flex justify-content-center align-items-center tag h5 p-4 rounded-circle bg-${color} text-white text-center`}>{tag}</span>
      </div>

      <div className="card-body">
        <div className="row  flex-column g-4">
          <div className="cols">
            <Card_hor product={product} color={color} order="1" />
            <Card_hor product={product} color={color} order="2" />
            <div className="d-none d-md-block">
              <Card_hor product={product} color={color} order="3" />
              <Card_hor product={product} color={color} order="4" />
              <Card_hor product={product} color={color} order="5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card_list;
