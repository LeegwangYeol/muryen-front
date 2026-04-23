import Script from "next/script";

/**
 * Google Analytics 4 + Naver Analytics 통합 로더.
 *
 * 활성화 방법 — Vercel 프로젝트 환경변수에 추가:
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX       (https://analytics.google.com 에서 발급)
 *   NEXT_PUBLIC_NAVER_ANALYTICS_ID=...   (https://analytics.naver.com 에서 발급)
 *
 * 둘 중 하나만 설정해도 해당 서비스만 활성화됩니다.
 * 환경변수 없으면 아무것도 로드하지 않음 (개발·프리뷰 트래픽 오염 방지).
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const naverId = process.env.NEXT_PUBLIC_NAVER_ANALYTICS_ID;

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
            src="//wcs.naver.net/wcslog.js"
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
