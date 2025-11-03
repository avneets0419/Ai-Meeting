import React from "react";
import Spline from '@splinetool/react-spline';

function HeroSection() {
  return (
    <div style={{ height: "100vh", background: "black" }}>
      <div
        style={{
          width: "100%",
          height: "93vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            width: "100%",
            height: "100vh",
            transform: "translateY(0)",
          }}
        >
          <Spline
            scene="https://prod.spline.design/gr4-Vs7ZFeI-HFLE/scene.splinecode"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
