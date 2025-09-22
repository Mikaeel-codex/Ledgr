//import GlassLiquidButton from "./GlassLiquidButton";
import { Routes, Route, useNavigate } from "react-router-dom";
import NextPage from "./NextPage";
import GlassSurface from "./components/GlassSurface";


export function Home() {
  const navigate = useNavigate();

  const VIDEO_W = 530; 
  const VIDEO_H = 350; 
  const BTN_W = 300;
  const BTN_H = 70;

  const handleGo = async () => {
  // Ask NextPage to try as a fallback
  sessionStorage.setItem("requestPlayWave", "1");

  try {
    const a = new Audio("/audio/con la.mp4"); 
    a.loop = true;

    // Start during the click (user gesture) so it isn't blocked
    await a.play();

    // Keep a handle so NextPage can reuse it
    (window as Window & { __bgAudio?: HTMLAudioElement }).__bgAudio = a;

    // Mark as already played for this tab
    sessionStorage.setItem("audioPlayedOnce", "1");
  } catch (err) {
    console.warn("Audio play() blocked:", err);
    // NextPage will attempt once more if needed
  } finally {
    // Navigate after attempting to start audio
    navigate("/next");
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#1d1d1dff", 
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

          

          <GlassSurface
            width={BTN_W}
            height={BTN_H}
            borderRadius={30}
            blur={5}
            brightness={60}
            opacity={0.9}
            backgroundOpacity={0.08}
            saturation={1.2}
            glowColor="255,255,255"      // ← white glow (use "r,g,b")
            glowIntensity={0.60}
            glowRadius={10}           // smaller blur
            glowSpread={-3}         // ← 0–1 strength
            onClick={handleGo}
            className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 text-xl font-semibold text-white select-none">
              Launch Me
            </span>
          </GlassSurface>
       
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

