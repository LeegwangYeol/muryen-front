import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

describe("Tooltip Component (components/ui/tooltip.tsx)", () => {
  it("renders tooltip trigger element correctly", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button>Hover Me</button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tooltip text info</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByRole("button", { name: /hover me/i });
    expect(trigger).toBeInTheDocument();
  });

  it("shows tooltip content on focus/hover", async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button>Target Button</button>
          </TooltipTrigger>
          <TooltipContent data-testid="tooltip-content">
            <p>Detailed Info</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const button = screen.getByRole("button", { name: /target button/i });
    await user.hover(button);

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip.textContent).toContain("Detailed Info");
  });

  it("applies custom classNames and sideOffset to TooltipContent", async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button>Styled Trigger</button>
          </TooltipTrigger>
          <TooltipContent className="custom-tooltip-class" sideOffset={8}>
            <p>Custom Styled</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    await user.hover(screen.getByRole("button", { name: /styled trigger/i }));
    const tooltipSpan = await screen.findByRole("tooltip");
    const contentContainer = tooltipSpan.parentElement;
    expect(contentContainer).toHaveClass("custom-tooltip-class", "bg-primary");
  });
});
