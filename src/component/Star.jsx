import iconStar from "/icons/iconStar.svg";
import iconEmptyStar from "/icons/iconEmptyStar.svg";

function Star({ star }) {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <img key={i} src={i < star ? iconStar : iconEmptyStar} alt={i < star ? "star" : "empty star"} />
      ))}
    </>
  );
}

export default Star;
