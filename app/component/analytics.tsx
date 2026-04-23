import Script from "next/script";
import { ANALYTICS } from "@/lib/contact";

/**
 * Google Analytics 4 + Naver Analytics 통합 로더.
 *
 * ID는 {@link ANALYTICS}에 하드코딩되어 있으며,
 * 필요 시 환경변수(NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_NAVER_ANALYTICS_ID)로 오버라이드 가능합니다.
 *
 * ID가 비어 있으면 해당 서비스 스크립트는 아예 로드되지 않습니다 (개발·프리뷰 트래픽 오염 방지).
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID ?? ANALYTICS.ga4;
  const naverId =
    process.env.NEXT_PUBLIC_NAVER_ANALYTICS_ID ?? ANALYTICS.naver;

  return (
    <>
      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
                anonymize_ip: true
              });
            `}
          </Script>
        </>
      ) : null}

      {naverId ? (
        <>
          <Script
            src="//wcs.pstatic.net/wcslog.js"
            strategy="afterInteractive"
          />
          <Script id="naver-analytics-init" strategy="afterInteractive">
            {`
              if(!window.wcs_add) window.wcs_add = {};
              window.wcs_add["wa"] = "${naverId}";
              if (window.wcs) {
                window.wcs_do();
              } else {
                window.addEventListener('load', function(){
                  if (window.wcs) window.wcs_do();
                });
              }
            `}
          </Script>
        </>
      ) : null}
    </>
  );
}
