import Card_hor from "../Cards/Card_hor";

function Card_list({ title, subTitle, tag, color, products }) {
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
            {products[0] ? <Card_hor product={products[0]} color={color} order="1" /> : <></>}
            {products[1] ? <Card_hor product={products[1]} color={color} order="2" /> : <></>}
            <div className="d-none d-md-block">
              {products[2] ? <Card_hor product={products[2]} color={color} order="3" /> : <></>}
              {products[3] ? <Card_hor product={products[3]} color={color} order="4" /> : <></>}
              {products[4] ? <Card_hor product={products[4]} color={color} order="5" /> : <></>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card_list;
