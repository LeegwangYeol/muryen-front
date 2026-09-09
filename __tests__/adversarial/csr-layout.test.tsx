import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { Providers } from "@/app/providers";
import Navigation from "@/app/component/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AppShell } from "@/components/layout/app-shell";
import { ThemeProvider } from "@/app/context/theme-context";
import { InteractivePlayer } from "@/components/video/interactive-player";
import { VadAnalyzer } from "@/components/ai/vad-analyzer";
import {
  AttendanceLineChart,
  SkillsRadarChart,
  SparringBarChart,
} from "@/components/dashboard/stat-charts";
import LoginPage from "@/app/component/login-page";
import VideoCircle from "@/app/component/video-circle";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-session-provider">{children}</div>
  ),
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

describe("M1 Adversarial Suite: Client-Side Rendering & Layout Integrity", () => {
  beforeEach(() => {
    document.cookie = "";
    jest.clearAllMocks();
  });

  describe("1. Providers & SessionProvider Resilience", () => {
    it("renders Providers wrapper with nested children safely", () => {
      render(
        <Providers>
          <div data-testid="child-element">Hello World</div>
        </Providers>
      );
      expect(screen.getByTestId("mock-session-provider")).toBeInTheDocument();
      expect(screen.getByTestId("child-element")).toHaveTextContent("Hello World");
    });
  });

  describe("2. Navigation & MobileNav Absence of LLAMI and VideoModal", () => {
    it("renders Navigation sidebar cleanly without VideoModal iframe or unexpected modals", () => {
      render(
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      );

      // Verify no iframe or video elements are rendered
      expect(document.querySelector("iframe")).toBeNull();
      expect(document.querySelector("video")).toBeNull();

      // Verify no LLAMI chat widget elements exist
      expect(document.querySelector("#llami-chat-widget")).toBeNull();
      expect(document.querySelector(".llami-widget")).toBeNull();
    });

    it("handles cookie-based auth state changes in Navigation without errors", () => {
      document.cookie = "isLoggedIn=true; path=/";
      render(
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      );

      // Verify logout button appears when logged in
      expect(screen.getByRole("button", { name: /로그아웃/i })).toBeInTheDocument();
    });

    it("renders MobileNav without crashing and responds to cookie auth state", () => {
      document.cookie = "accessToken=mock-token; path=/";
      render(
        <ThemeProvider>
          <MobileNav />
        </ThemeProvider>
      );

      // Verify mobile nav buttons (theme toggle + menu open) exist
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("3. AppShell & Theme Integration", () => {
    it("renders AppShell wrapping content within ThemeProvider", () => {
      render(
        <ThemeProvider>
          <AppShell>
            <main data-testid="app-shell-content">Main Page Content</main>
          </AppShell>
        </ThemeProvider>
      );

      expect(screen.getByTestId("app-shell-content")).toBeInTheDocument();
    });
  });

  describe("4. Dashboard Charts & Interactive Video Player", () => {
    it("renders AttendanceLineChart, SkillsRadarChart, and SparringBarChart with sample data", () => {
      const { container: lineChartContainer } = render(
        <AttendanceLineChart
          data={[{ month: "1월", attendance: 5 }]}
          isDark={true}
          textColor="#fff"
          gridColor="#333"
        />
      );
      expect(lineChartContainer).toBeDefined();

      const { container: radarContainer } = render(
        <SkillsRadarChart
          data={[{ skill: "검법", score: 80 }]}
          isDark={false}
          textColor="#000"
          gridColor="#ddd"
        />
      );
      expect(radarContainer).toBeDefined();

      const { container: barContainer } = render(
        <SparringBarChart
          data={[{ name: "머리", hits: 10 }]}
          isDark={true}
          textColor="#fff"
          gridColor="#333"
        />
      );
      expect(barContainer).toBeDefined();
    });

    it("mounts InteractivePlayer safely on client side", () => {
      render(
        <ThemeProvider>
          <InteractivePlayer url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="기초 검법" />
        </ThemeProvider>
      );

      expect(screen.getByText("기초 검법")).toBeInTheDocument();
      expect(screen.getByText("교보재")).toBeInTheDocument();
    });
  });

  describe("5. VAD AI Analyzer Adversarial Edge Cases", () => {
    it("gracefully warns when window.vad is missing upon toggle", async () => {
      delete (window as any).vad;

      render(
        <ThemeProvider>
          <VadAnalyzer />
        </ThemeProvider>
      );

      const micButton = screen.getByRole("button", { name: /마이크 켜기/i });
      await act(async () => {
        fireEvent.click(micButton);
      });

      expect(screen.getByText(/VAD 모듈이 아직 로드되지 않았습니다/i)).toBeInTheDocument();
    });
  });

  describe("6. Layout Centering & Client Component Boundaries", () => {
    it("renders LoginPage with clean centered layout without redundant left margin offsets", () => {
      const { container } = render(
        <ThemeProvider>
          <LoginPage />
        </ThemeProvider>
      );

      const mainContainer = container.querySelector(".min-h-screen");
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer?.className).not.toContain("md:ml-24");
      expect(mainContainer?.className).toContain("flex items-center justify-center");
    });

    it("renders VideoCircle client component safely with items", () => {
      const sampleVideos = [
        {
          id: "1",
          title: "본국검",
          description: "조선 전통 본국검형",
          thumbnail: "/images/bg-night.webp",
        },
      ];

      render(
        <ThemeProvider>
          <VideoCircle videos={sampleVideos} />
        </ThemeProvider>
      );

      expect(screen.getByText("본국검")).toBeInTheDocument();
    });
  });
});
