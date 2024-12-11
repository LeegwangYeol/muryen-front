"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

interface LLAMIChatWidgetProps {
  theme?: string | undefined;
}

export const LLAMIChatWidget = ({ theme }: LLAMIChatWidgetProps) => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/chat-link")) return;
    if (pathname.startsWith("/catalog/llami-chat")) theme = "catalog";
    const isExcludedPath = pathname.startsWith("/chat");
    if (!isExcludedPath) {
      // 위젯 로드 및 초기화
      // CSS 로드
      const cssUrl = "https://static.llami.net/widget-v1.css";
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = cssUrl;
      document.head.appendChild(link);

      // 위젯 스크립트 로드 및 실행
      const script = document.createElement("script");
      script.type = "module";
      script.textContent = `
        import { initialize } from "https://static.llami.net/widget-v1.js";
        initialize({
          widgetId: "9afddf76-2d21-422c-a4fc-a369fcf21d09",
          
        });
      `;
      document.body.appendChild(script);

      // 클린업 함수 반환
      return () => {
        // 위젯 제거
        const widgetElement = document.getElementById("llami-chat-widget");
        if (widgetElement && widgetElement.parentNode) {
          widgetElement.parentNode.removeChild(widgetElement);
        }

        // CSS 링크 제거
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }

        // 스크립트 태그 제거
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } else {
      // 제외된 경로로 이동 시 위젯 제거
      const widgetElement = document.getElementById("llami-gpt-widget");
      if (widgetElement && widgetElement.parentNode) {
        widgetElement.parentNode.removeChild(widgetElement);
      }

      // 혹시 남아있는 CSS 링크 제거
      const existingLink = document.querySelector(
        `link[href="https://static.llami.net/widget-v1.css"]`
      );
      if (existingLink && existingLink.parentNode) {
        existingLink.parentNode.removeChild(existingLink);
      }
    }
  }, [pathname]);

  return (
    <>
      <Script
        src="https://static.llami.net/widget-v1.js"
        type="module"
        strategy="afterInteractive"
        onReady={() => {
          const script = document.createElement("script");
          script.type = "module";
          script.textContent = `
            import { initialize, run } from "https://static.llami.net/widget-v1.js";
            run("9afddf76-2d21-422c-a4fc-a369fcf21d09");
          `;
          document.head.appendChild(script);
        }}
      />
      <Script id="llami-styles" strategy="beforeInteractive">{`
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://static.llami.net/widget-v1.css';
        document.head.appendChild(link);
      `}</Script>
    </>
  );
};
