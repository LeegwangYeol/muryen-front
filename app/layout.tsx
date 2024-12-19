import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import VantaBackground from "./component/vanta-main-background";

export const metadata: Metadata = {
  title: "武로 緣을 잇다",
  description: "武緣 메인",
  icons: {
    // icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://static.llami.net/widget-v1.css"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.19/dist/bundle.min.js"
          strategy="lazyOnload"
        />
        <Script type="module" id="llami-chat-widget" strategy="lazyOnload">
          {`
            import { initialize, run } from "https://static.llami.net/widget-v1.js";
            run("9afddf76-2d21-422c-a4fc-a369fcf21d09");
          `}
        </Script>
      </head>
      <body>
        <VantaBackground>{children}</VantaBackground>
      </body>
    </html>
  );
}
