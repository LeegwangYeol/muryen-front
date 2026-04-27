/**
 * 라우트 전환 중 자동 노출되는 스켈레톤.
 * - 상단 진행바: 좌→우로 미끄러지는 그라데이션 (불특정 시간 indeterminate)
 * - 중앙 안내 텍스트 + 점 3개 애니메이션
 * - 콘텐츠 플레이스홀더는 기존 pulse 유지
 *
 * 모든 모션은 globals.css 의 prefers-reduced-motion 규칙으로 자동 비활성화됨.
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 상단 진행바 — fixed로 화면 최상단에 붙음 */}
      <div
        role="progressbar"
        aria-busy="true"
        aria-valuetext="로딩 중"
        aria-label="페이지 로딩 중"
        className="fixed top-0 left-0 right-0 z-[80] h-0.5 overflow-hidden bg-current/5"
      >
        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-current to-transparent opacity-70 animate-[loadingBar_1.4s_ease-in-out_infinite]" />
      </div>

      {/* 안내 텍스트 + 회전 인디케이터 */}
      <div className="mb-6 flex items-center justify-center gap-3 text-sm sm:text-base opacity-70">
        <span className="inline-block w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
        <span>
          곧 보여드릴게요
          <span className="inline-block ml-1 align-baseline">
            <span className="inline-block animate-[loadingDot_1.2s_ease-in-out_infinite]">·</span>
            <span className="inline-block animate-[loadingDot_1.2s_ease-in-out_infinite] [animation-delay:0.2s]">·</span>
            <span className="inline-block animate-[loadingDot_1.2s_ease-in-out_infinite] [animation-delay:0.4s]">·</span>
          </span>
        </span>
      </div>

      {/* 콘텐츠 플레이스홀더 */}
      <div className="animate-pulse">
        <div className="mb-10 flex justify-center">
          <div className="h-10 w-80 rounded-lg bg-current/10" />
        </div>

        <div className="rounded-xl p-8 mb-8 bg-current/5 border border-current/10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 aspect-video rounded-lg bg-current/10" />
            <div className="md:w-1/2 space-y-3 pt-2">
              <div className="h-4 w-full rounded bg-current/10" />
              <div className="h-4 w-5/6 rounded bg-current/10" />
              <div className="h-4 w-4/6 rounded bg-current/10" />
              <div className="h-4 w-3/6 rounded bg-current/10" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl p-6 bg-current/5 border border-current/10 space-y-3">
            <div className="h-6 w-1/2 rounded bg-current/10" />
            <div className="h-4 w-full rounded bg-current/10" />
            <div className="h-4 w-5/6 rounded bg-current/10" />
          </div>
          <div className="rounded-xl p-6 bg-current/5 border border-current/10 space-y-3">
            <div className="h-6 w-1/2 rounded bg-current/10" />
            <div className="h-4 w-full rounded bg-current/10" />
            <div className="h-4 w-5/6 rounded bg-current/10" />
          </div>
        </div>

        <div className="rounded-xl p-6 bg-current/5 border border-current/10 space-y-3">
          <div className="h-6 w-1/3 rounded bg-current/10" />
          <div className="h-4 w-full rounded bg-current/10" />
          <div className="h-4 w-11/12 rounded bg-current/10" />
          <div className="h-4 w-5/6 rounded bg-current/10" />
        </div>
      </div>
    </div>
  );
}
