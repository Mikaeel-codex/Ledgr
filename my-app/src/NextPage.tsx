import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type Status = "starting" | "started" | "playedAlready";

export default function NextPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const VIDEO_W = 1080;  
  const VIDEO_H = 750;  

  // Detect reload (modern + legacy)
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  type LegacyPerformance = Performance & { navigation?: { type?: number } };
  const legacyNav = (performance as LegacyPerformance).navigation;
  const isReload = nav?.type === "reload" || legacyNav?.type === 1;

  const [status, setStatus] = useState<Status>(() => {
    const already = sessionStorage.getItem("audioPlayedOnce") === "1";
    if (already && isReload) return "playedAlready";
    if (already) return "started";
    return "starting";
  });

  useEffect(() => {
    const shouldPlay = sessionStorage.getItem("requestPlayWave") === "1";
    const already = sessionStorage.getItem("audioPlayedOnce") === "1";
    sessionStorage.removeItem("requestPlayWave");

    if (shouldPlay && !already) {
      const a = new Audio("/audio/con la.mp4"); 
      a.loop = true;
      audioRef.current = a;

      a.play()
        .then(() => {
          sessionStorage.setItem("audioPlayedOnce", "1");
          setStatus("started");
        })
        .catch(() => {
        });
    } else if (already) {
      setStatus(isReload ? "playedAlready" : "started");
    }

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [isReload]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        gap: 16,
        background:
          "linear-gradient(180deg, #68b8dd 0%, #a6d7f3 50%, #e8f7ff 100%)",
        textAlign: "center",
        padding: 24,
      }}
    >
      {/* Centered video box sitting on top of the blue background */}
      <div
        style={{
          position: "relative",
          width: VIDEO_W,
          height: VIDEO_H,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        }}
      >
        <video
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
        >
          <source src="/videos/fluffy.mp4" type="video/mp4" />

        </video>

        {/* Overlay your text on top of the video */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
        >
          <div>
            <h1
                style={{
                margin: 0,
                color: "#0b4f6c",
                textShadow: "0 1px 2px rgba(255,255,255,0.65)",
                fontSize: 48,         // ⬅️ add this (px)
                lineHeight: 1.1,      // optional
                fontWeight: 800,      // optional: bolder title
                }}
            >
                Welcome 🎧
            </h1>

            <p
                style={{
                margin: "8px 0 0",
                opacity: 0.9,
                fontWeight: 700,       // a bit bolder
                color: "#0b4f6c",
                textShadow: "0 1px 2px rgba(255,255,255,0.65)",
                fontSize: 20,          // ⬅️ add this (px)
                lineHeight: 1.4,       // optional
                }}
            >
                {status === "starting"
                ? "Starting audio..."
                : status === "playedAlready"
                ? "Audio played already for this tab."
                : "Audio started once for this tab."}
            </p>
          </div>
        </div>
      </div>

      <Link to="/" style={{ marginTop: 8, fontWeight: 700, color: "#0b4f6c" }}>
        ⟵ Back Home
      </Link>
    </div>
  );
}
