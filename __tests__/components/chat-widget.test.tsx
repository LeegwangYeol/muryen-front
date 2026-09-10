import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/app/context/theme-context";
import { ChatWidget } from "@/components/chat/chat-widget";
import * as tokki from "@/lib/tokki";

jest.mock("@/lib/tokki", () => ({
  TOKKI_WIDGET_ID: "muryen",
  loadWidget: jest.fn(),
  ask: jest.fn(),
}));

describe("ChatWidget Component Defensive Masking (components/chat/chat-widget.tsx)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    (tokki.loadWidget as jest.Mock).mockResolvedValue({
      persona: {
        name: "무련봇",
        description: "온라인 · 안내",
        welcome_message: "무련에 오신 것을 환영합니다.",
        questions: ["무련은 어떤 곳인가요?"],
      },
      threadId: "mock-thread-id",
      messages: [],
    });
  });

  it("renders launcher bubble with accessible label and toggles panel", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ChatWidget />
      </ThemeProvider>
    );

    const launcher = screen.getByRole("button", { name: "채팅 도우미 열기" });
    expect(launcher).toBeInTheDocument();

    await user.click(launcher);

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /채팅/ })).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "채팅 도우미 닫기" })).toBeInTheDocument();
  });

  it("defensively masks [LLM error] and insufficient_quota upstream OpenAI errors", async () => {
    const user = userEvent.setup();
    (tokki.ask as jest.Mock).mockImplementation(async ({ onToken }) => {
      const rawError =
        '[LLM error] [openai] 429 Too Many Requests: {"error":{"message":"You have no credits remaining.","type":"insufficient_quota"}}';
      onToken(rawError);
      return rawError;
    });

    render(
      <ThemeProvider>
        <ChatWidget />
      </ThemeProvider>
    );

    await user.click(screen.getByRole("button", { name: "채팅 도우미 열기" }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("메시지를 입력하세요…")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("메시지를 입력하세요…");
    await user.type(input, "무련 소개{enter}");

    await waitFor(() => {
      expect(
        screen.getByText("AI 도우미가 현재 점검 중입니다. 잠시 후 다시 이용해 주세요.")
      ).toBeInTheDocument();
    });

    // Verify raw upstream error is never exposed in the DOM
    expect(screen.queryByText(/insufficient_quota/)).toBeNull();
    expect(screen.queryByText(/\[LLM error\]/)).toBeNull();
  });

  it("renders normal assistant messages when no quota error occurs", async () => {
    const user = userEvent.setup();
    (tokki.ask as jest.Mock).mockImplementation(async ({ onToken }) => {
      const normalResponse = "무련은 24반 무예를 수련하는 단체입니다.";
      onToken(normalResponse);
      return normalResponse;
    });

    render(
      <ThemeProvider>
        <ChatWidget />
      </ThemeProvider>
    );

    await user.click(screen.getByRole("button", { name: "채팅 도우미 열기" }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("메시지를 입력하세요…")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("메시지를 입력하세요…");
    await user.type(input, "무련이란?{enter}");

    await waitFor(() => {
      expect(
        screen.getByText("무련은 24반 무예를 수련하는 단체입니다.")
      ).toBeInTheDocument();
    });
  });
});
