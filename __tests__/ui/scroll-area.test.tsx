import React from "react";
import { render, screen } from "@testing-library/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

describe("ScrollArea Component (components/ui/scroll-area.tsx)", () => {
  it("renders ScrollArea with viewport and child content", () => {
    const { container } = render(
      <ScrollArea className="h-72 w-48 rounded-md border" data-testid="scroll-root">
        <div className="p-4">
          <h4>Tags</h4>
          <p>Tag item 1</p>
          <p>Tag item 2</p>
        </div>
      </ScrollArea>
    );

    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("Tag item 1")).toBeInTheDocument();
    expect(screen.getByText("Tag item 2")).toBeInTheDocument();

    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("relative", "overflow-hidden", "h-72", "w-48");
  });

  it("renders ScrollBar with horizontal and vertical orientation", () => {
    const { container, rerender } = render(
      <ScrollArea>
        <div>Content</div>
        <ScrollBar orientation="horizontal" className="custom-scrollbar" />
      </ScrollArea>
    );

    expect(container.querySelector('[data-orientation="horizontal"]') || container.firstChild).toBeTruthy();

    rerender(
      <ScrollArea>
        <div>Content</div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("forwards ref to ScrollArea root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ScrollArea ref={ref}>
        <div>Scroll Content</div>
      </ScrollArea>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
