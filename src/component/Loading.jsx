import React, { useRef, useEffect } from "react";
import Lottie from "lottie-react";
// 引入你下載的 JSON 檔案
import plantAnimation from "../assets/animations/loading.json";

function Loading({ text }) {
  const lottieRef = useRef();

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(1.5); 
    }
  }, []);
  return (
    <div style={containerStyle}>
      <div style={{ width: 200, height: 200 }}>
        <Lottie 
        lottieRef={lottieRef}
          animationData={plantAnimation} 
          loop={true} 
          autoplay={true} 
        />
      </div>
      {text && <p style={textStyle}>{text}</p>}
    </div>
  );
}

// 簡單的樣式設定，確保 Loading 居中且覆蓋全螢幕
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f1ede6", 
};

const textStyle = {
  marginTop: "0",
  fontSize: "1.3rem",
  color: "#4A6741", 
  fontWeight: "700",
  letterSpacing: "2px"
};

export default Loading;
