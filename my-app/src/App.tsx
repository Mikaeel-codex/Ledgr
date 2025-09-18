import GlassLiquidButton from "./GlassLiquidButton";
import { Routes, Route, useNavigate } from "react-router-dom";
import NextPage from "./NextPage";

export function Home() {
  const navigate = useNavigate();

  const VIDEO_W = 530; 
  const VIDEO_H = 350; 
  const BTN_W = 330;
  const BTN_H = 80;

  const handleGo = () => {
    sessionStorage.setItem("requestPlayWave", "1");
    navigate("/next");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#68b8ddff", 
      }}
    >
      
      <div 
        style={{
          position: "relative",
          width: VIDEO_W,
          height: VIDEO_H,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >

    {/*    <img
          src="/images/background.jpg"
          alt=""
          draggable="false"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none", 
          }}
        /> */}

        <video
          src="/videos/water.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />

   
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.25))",
            pointerEvents: "none",
          }}
        />

       
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
          }}
        >  
          <GlassLiquidButton
            onClick={handleGo}
            width={BTN_W}
            height={BTN_H}
            radius={18}
            tint="#ffffffff"
            transparency={0}   
            blurPx={0.1}          
            hoverShadow={80}
            hoverShadowSize={0.4}  
            hoverLift={3} 
            rippleStrength={18}
            rippleSpeedSec={10}
          >
            Launch Me
          </GlassLiquidButton>
        </div>
      </div> 
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/next" element={<NextPage />} />
    </Routes>
  );
}

