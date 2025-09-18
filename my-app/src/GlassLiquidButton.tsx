import React, { useId } from "react";

type Props = {
  children?: React.ReactNode;
  onClick?: () => void;
  tint?: string;
  textColor?: string;
  width?: number;
  height?: number;
  radius?: number;

  transparency?: number;
  blurPx?: number;
  hoverShadow?: number | string;
  hoverLift?: number;
  hoverShadowSize?: number;
  waterRipple?: boolean;
  rippleStrength?: number;
  rippleSpeedSec?: number;
};

export default function GlassLiquidButton({
  children = "Lunche Me",
  onClick,
  tint = "#74c7c5",
  textColor = "#ffffff",
  width = 180,
  height = 52,
  radius = 14,

  transparency = 0.9,
  blurPx = 16,

  hoverShadow = 1,
  hoverLift = 2,
  hoverShadowSize = 1,

  waterRipple = true,
  rippleStrength = 12,
  rippleSpeedSec = 6,
}: Props) {
  const alpha = Math.max(0, Math.min(1, transparency));

  const hsRaw =
    typeof hoverShadow === "string" ? parseFloat(hoverShadow) : hoverShadow ?? 1;
  const hs = Math.max(0, Math.min(hsRaw <= 1 ? hsRaw : hsRaw / 100, 1));
  const hMul = Math.max(0.1, hoverShadowSize ?? 1);

  // unique & CSS-safe id for the filter (so multiple buttons don't clash)
  const rippleId = useId().replace(/:/g, "_");

  return (
    <>
      <button
        className="glx-btn"
        type="button"
        onClick={onClick}
        style={
          {
            "--glx-tint": tint,
            "--glx-text": textColor,
            "--glx-radius": `${radius}px`,
            "--glx-alpha": alpha.toString(),
            "--glx-blur": `${blurPx}px`,
            "--glx-lift": `${hoverLift}px`,
            "--glx-shadowA": `rgba(0,0,0,${0.9 * hs})`,
            "--glx-shadowB": `rgba(0,0,0,${0.7 * hs})`,
            "--glx-shadowCore": `rgba(0,0,0,${0.42 * hs})`,
            "--glx-shadowMul": hMul.toString(),
            width: `${width}px`,
            height: `${height}px`,
          } as React.CSSProperties
        }
      >
        {/* layers */}
        <span className="glx-glass" />
        <span className="glx-edge" />
        {waterRipple && (
          <span className="glx-ripple" style={{ filter: `url(#${rippleId})` }} />
        )}
        <span className="glx-halo" />
        <span className="glx-label">{children}</span>
      </button>

      {/* SVG filter for the water ripple */}
      {waterRipple && (
        <svg
          width="0"
          height="0"
          aria-hidden
          focusable="false"
          style={{ position: "absolute" }}
        >
          <filter id={rippleId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.011 0.017"
              numOctaves="2"
              seed="2"
            >
              <animate
                attributeName="baseFrequency"
                dur={`${rippleSpeedSec}s`}
                values="0.011 0.017; 0.014 0.022; 0.011 0.017"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale={rippleStrength} />
          </filter>
        </svg>
      )}

      <style>{`
        .glx-btn {
          position: relative;
          display: inline-grid;
          place-items: center;
          border-radius: var(--glx-radius);
          overflow: hidden;
          cursor: pointer;
          user-select: none;
          isolation: isolate;

          /* base frosted plate */
          background:
            linear-gradient(140deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06));
          border: 1px solid rgba(255,255,255,0.35);
          backdrop-filter: blur(var(--glx-blur)) saturate(160%);
          -webkit-backdrop-filter: blur(var(--glx-blur)) saturate(160%);

          /* depth */
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.55),
            0 8px 24px rgba(0,0,0,0.30),
            0 2px 8px rgba(0,0,0,0.18);

          transition:
            transform .18s cubic-bezier(.2,.7,.2,1),
            box-shadow .22s ease,
            border-color .22s ease;
          color: var(--glx-text);
        }

        .glx-btn:hover {
          transform: translateY(calc(-1px - var(--glx-lift)));
          border-color: rgba(255,255,255,0.55);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.70),
            /* wide soft plume */
            0 calc(40px * var(--glx-shadowMul)) calc(120px * var(--glx-shadowMul)) var(--glx-shadowA),
            /* mid plume */
            0 calc(18px * var(--glx-shadowMul))  calc(48px  * var(--glx-shadowMul)) var(--glx-shadowB),
            /* compact core near the button */
            0 6px 14px var(--glx-shadowCore);
        }

        .glx-btn:active { transform: translateY(0) scale(0.985); }

        .glx-edge, .glx-glass, .glx-ripple, .glx-halo {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
        }

        .glx-glass {
          opacity: var(--glx-alpha);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.14) 45%, rgba(255,255,255,0.08) 100%),
            radial-gradient(120% 100% at 50% 0%,
              color-mix(in srgb, var(--glx-tint) 22%, transparent) 0%,
              transparent 70%);
        }

        .glx-edge {
          opacity: calc(0.6 * var(--glx-alpha));
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.28),
            inset 0 -10px 20px rgba(0,0,0,0.12);
        }

        /* Water ripple overlay (works even with transparency: 0 and tiny blur) */
        .glx-ripple {
          background:
            radial-gradient(120% 90% at 50% 35%,
              rgba(255,255,255,0.32) 0%,
              rgba(255,255,255,0.15) 42%,
              rgba(255,255,255,0.06) 68%,
              rgba(255,255,255,0.00) 78%);
          mix-blend-mode: screen;
          opacity: .55;
          transition: opacity .25s ease;
        }
        .glx-btn:hover .glx-ripple { opacity: .75; }

        .glx-halo {
          opacity: 0;
          transition: opacity .25s ease;
          background:
            radial-gradient(120% 140% at 50% 0%,
              rgba(255,255,255,0.22),
              rgba(255,255,255,0));
          filter: blur(10px);
          z-index: -1;
        }
        .glx-btn:hover .glx-halo { opacity: .9; }

        .glx-label {
          position: relative; z-index: 2;
          font-weight: 700;
          letter-spacing: .02em;
          font-size: 15px;
          text-shadow: 0 1px 0 rgba(255,255,255,0.35);
        }
      `}</style>
    </>
  );
}
