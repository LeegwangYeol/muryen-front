"use client";

interface MainLayoutProps {
  children: React.ReactNode;
}

// MainLayout is now a pass-through wrapper.
// The actual application shell (Navigation + main area) lives in the root
// layout via <AppShell>, so that Navigation persists across route changes
// and does not flicker/re-mount on every navigation.
export function MainLayout({ children }: MainLayoutProps) {
  return <>{children}</>;
}
