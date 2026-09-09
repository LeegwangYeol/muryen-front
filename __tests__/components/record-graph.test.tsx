import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/app/context/theme-context";
import RecordGraph from "@/app/component/record-graph";

describe("RecordGraph Component (app/component/record-graph.tsx)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders 'Commit History' title and year sections", () => {
    render(
      <ThemeProvider>
        <RecordGraph />
      </ThemeProvider>
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Commit History" })
    ).toBeInTheDocument();

    // Check year sections
    expect(screen.getByRole("heading", { level: 3, name: "2024" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "2023" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "2022" })).toBeInTheDocument();
  });

  it("renders commit day cells with aria-labels", () => {
    render(
      <ThemeProvider>
        <RecordGraph />
      </ThemeProvider>
    );

    // Commit day buttons with aria-label format: 'YYYY-MM-DD: N회 수련'
    const dayButtons = screen.getAllByRole("button", { name: /\d{4}-\d{2}-\d{2}: \d+회 수련/ });
    expect(dayButtons.length).toBeGreaterThan(1000); // 3 full years of days (1,095+ cells)
  });

  it("opens modal dialog showing training records when a day cell is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <RecordGraph />
      </ThemeProvider>
    );

    const dayButtons = screen.getAllByRole("button", { name: /\d{4}-\d{2}-\d{2}: \d+회 수련/ });
    const targetButton = dayButtons[0];
    const ariaLabel = targetButton.getAttribute("aria-label") || "";
    const datePart = ariaLabel.split(":")[0]; // e.g. '2024-01-01'

    await user.click(targetButton);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /의 수련 기록/ })
    ).toBeInTheDocument();
  });

  it("closes the detail dialog when close button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <RecordGraph />
      </ThemeProvider>
    );

    const dayButtons = screen.getAllByRole("button", { name: /\d{4}-\d{2}-\d{2}: \d+회 수련/ });
    await user.click(dayButtons[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close button (X icon button in dialog)
    const closeBtn = screen.getByRole("button", { name: "Close" });
    await user.click(closeBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
