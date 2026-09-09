import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, buttonVariants } from "@/components/ui/button";

describe("Button Component (components/ui/button.tsx)", () => {
  it("renders default button with children correctly", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveClass("bg-primary", "text-primary-foreground");
  });

  it("applies all variant classes accurately", () => {
    const { rerender } = render(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-destructive", "text-destructive-foreground");

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border", "border-input", "bg-background");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-secondary", "text-secondary-foreground");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("hover:bg-accent", "hover:text-accent-foreground");

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-primary", "underline-offset-4");
  });

  it("applies size variants accurately", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-8", "px-3", "text-xs");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-10", "px-8");

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-9", "w-9");

    rerender(<Button size="default">Default Size</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-9", "px-4", "py-2");
  });

  it("handles click events", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Action</Button>);
    await user.click(screen.getByRole("button", { name: /action/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("respects disabled state and prevents click handler invocation", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:pointer-events-none", "disabled:opacity-50");

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders as a child element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test-link">Link Button</a>
      </Button>
    );

    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test-link");
    expect(link).toHaveClass("bg-primary", "text-primary-foreground");
  });

  it("merges custom className with variant styles", () => {
    render(<Button className="custom-test-class shadow-2xl">Custom</Button>);
    const button = screen.getByRole("button", { name: /custom/i });
    expect(button).toHaveClass("custom-test-class", "shadow-2xl", "bg-primary");
  });

  it("exposes buttonVariants helper directly", () => {
    const classes = buttonVariants({ variant: "destructive", size: "lg" });
    expect(classes).toContain("bg-destructive");
    expect(classes).toContain("h-10");
  });
});
