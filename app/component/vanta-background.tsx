import Script from "next/script";

declare global {
  interface Window {
    VANTA: any;
  }
}

export default function VantaBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  const initVanta = () => {
    if (window.VANTA)
      window.VANTA.FOG({
        el: ".vanta-fog",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        highlightColor: 0x524c3a,
        midtoneColor: 0x9d6b63,
        baseColor: 0xededed,
      });
  };

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          initVanta();
        }}
      />
      <div className="vanta-fog" style={{ width: "100%", height: "100vh" }}>
        {children}
      </div>
    </>
  );
}
