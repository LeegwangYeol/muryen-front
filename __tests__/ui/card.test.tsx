import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

describe("Card Components (components/ui/card.tsx)", () => {
  it("renders a full composite card structure", () => {
    render(
      <Card data-testid="card-root">
        <CardHeader data-testid="card-header">
          <CardTitle data-testid="card-title">Card Headline</CardTitle>
          <CardDescription data-testid="card-desc">Card subtitle or description</CardDescription>
        </CardHeader>
        <CardContent data-testid="card-content">
          <p>Main body content of the card</p>
        </CardContent>
        <CardFooter data-testid="card-footer">
          <button>Card Action</button>
        </CardFooter>
      </Card>
    );

    const root = screen.getByTestId("card-root");
    const header = screen.getByTestId("card-header");
    const title = screen.getByTestId("card-title");
    const desc = screen.getByTestId("card-desc");
    const content = screen.getByTestId("card-content");
    const footer = screen.getByTestId("card-footer");

    expect(root).toBeInTheDocument();
    expect(root).toHaveClass("rounded-xl", "border", "bg-card", "text-card-foreground", "shadow");

    expect(header).toHaveClass("flex", "flex-col", "p-6");
    expect(title).toHaveClass("font-semibold", "leading-none");
    expect(title.textContent).toBe("Card Headline");

    expect(desc).toHaveClass("text-sm", "text-muted-foreground");
    expect(desc.textContent).toBe("Card subtitle or description");

    expect(content).toHaveClass("p-6", "pt-0");
    expect(content.textContent).toContain("Main body content");

    expect(footer).toHaveClass("flex", "items-center", "p-6", "pt-0");
  });

  it("applies custom classNames to all card components", () => {
    render(
      <Card className="custom-root">
        <CardHeader className="custom-header">
          <CardTitle className="custom-title">Title</CardTitle>
          <CardDescription className="custom-desc">Desc</CardDescription>
        </CardHeader>
        <CardContent className="custom-content">Content</CardContent>
        <CardFooter className="custom-footer">Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText("Title").closest(".custom-root")).toHaveClass("custom-root");
    expect(screen.getByText("Title")).toHaveClass("custom-title");
    expect(screen.getByText("Desc")).toHaveClass("custom-desc");
    expect(screen.getByText("Content")).toHaveClass("custom-content");
    expect(screen.getByText("Footer")).toHaveClass("custom-footer");
  });

  it("forwards ref to the card DOM elements", () => {
    const cardRef = React.createRef<HTMLDivElement>();
    const titleRef = React.createRef<HTMLDivElement>();

    render(
      <Card ref={cardRef}>
        <CardHeader>
          <CardTitle ref={titleRef}>Ref Title</CardTitle>
        </CardHeader>
      </Card>
    );

    expect(cardRef.current).toBeInstanceOf(HTMLDivElement);
    expect(titleRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
