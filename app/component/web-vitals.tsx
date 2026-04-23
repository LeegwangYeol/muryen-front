"use client";

import { useReportWebVitals } from "next/web-vitals";

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params: Record<string, unknown>,
    ) => void;
  }
}

/**
 * Core Web Vitals (LCP, FID, CLS, INP, TTFB, FCP) 를 GA4로 전송.
 * gtag가 로드되지 않은 환경(ANALYTICS.ga4 비어있을 때)에서는 조용히 건너뜁니다.
 *
 * GA4에서 "이벤트 탐색" → `web_vitals` 이벤트로 확인 가능.
 * 코어 웹 바이탈은 Google 검색 랭킹 신호이므로 실사용자(real-user) 측정이 중요.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value: Math.round(
        metric.name === "CLS" ? metric.value * 1000 : metric.value,
      ),
      non_interaction: true,
      metric_rating: metric.rating,
      metric_delta: metric.delta,
    });
  });
  return null;
}
