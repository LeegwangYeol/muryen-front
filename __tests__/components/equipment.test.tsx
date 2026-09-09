import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/app/context/theme-context";
import Equipment from "@/app/component/equipment";

describe("Equipment Page Component (app/component/equipment.tsx)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders page title and equipment cards", () => {
    render(
      <ThemeProvider>
        <Equipment />
      </ThemeProvider>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "전통 무예 장비 소개" })
    ).toBeInTheDocument();

    // Check all equipment cards
    expect(screen.getByText("전통 갑옷")).toBeInTheDocument();
    expect(screen.getByText("조선시대 전통 갑옷 복원품")).toBeInTheDocument();

    expect(screen.getByText("전투용 투구")).toBeInTheDocument();
    expect(screen.getByText("고려시대 스타일의 전투용 투구")).toBeInTheDocument();

    expect(screen.getByText("장창")).toBeInTheDocument();
    expect(screen.getByText("전통 장병기의 대표, 장창")).toBeInTheDocument();
  });

  it("renders equipment card images with correct alt attributes", () => {
    render(
      <ThemeProvider>
        <Equipment />
      </ThemeProvider>
    );

    const images = screen.getAllByRole("img");
    const armorImg = images.find((img) => img.getAttribute("alt") === "전통 갑옷");
    const helmetImg = images.find((img) => img.getAttribute("alt") === "전투용 투구");
    const spearImg = images.find((img) => img.getAttribute("alt") === "장창");

    expect(armorImg).toBeInTheDocument();
    expect(helmetImg).toBeInTheDocument();
    expect(spearImg).toBeInTheDocument();
  });

  it("opens modal with detailed info and purchase link when clicking '자세히 보기'", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <Equipment />
      </ThemeProvider>
    );

    const detailButtons = screen.getAllByRole("button", { name: "자세히 보기" });
    expect(detailButtons.length).toBe(3);

    // Click first item (전통 갑옷)
    await user.click(detailButtons[0]);

    // Modal should be open
    expect(screen.getByText("재료")).toBeInTheDocument();
    expect(screen.getByText("가죽, 철판, 끈")).toBeInTheDocument();
    expect(screen.getByText("제작 방법")).toBeInTheDocument();
    expect(screen.getByText(/1\. 가죽 재단/)).toBeInTheDocument();

    const purchaseLink = screen.getByRole("link", { name: /구매하기/i });
    expect(purchaseLink).toHaveAttribute("href", "https://example.com/traditional-armor");
    expect(purchaseLink).toHaveAttribute("target", "_blank");
    expect(purchaseLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("closes the detail modal when close button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <Equipment />
      </ThemeProvider>
    );

    const detailButtons = screen.getAllByRole("button", { name: "자세히 보기" });
    await user.click(detailButtons[1]); // 전투용 투구

    expect(screen.getByText("강철, 가죽")).toBeInTheDocument();

    // Close button (X icon button in modal header)
    const closeButtons = screen.getAllByRole("button");
    const modalCloseBtn = closeButtons.find((btn) => btn.querySelector("svg.lucide-x"));
    expect(modalCloseBtn).toBeDefined();

    await user.click(modalCloseBtn!);

    expect(screen.queryByText("강철, 가죽")).not.toBeInTheDocument();
  });
});
