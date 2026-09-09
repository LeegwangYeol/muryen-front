import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input Component (components/ui/input.tsx)", () => {
  it("renders input element with default attributes", () => {
    render(<Input placeholder="Enter username" data-testid="test-input" />);
    const input = screen.getByTestId("test-input");

    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("placeholder", "Enter username");
    expect(input).toHaveClass("border-input", "rounded-md", "h-9");
  });

  it("handles different input types (password, email, number)", () => {
    const { rerender } = render(<Input type="password" data-testid="input-type" />);
    expect(screen.getByTestId("input-type")).toHaveAttribute("type", "password");

    rerender(<Input type="email" data-testid="input-type" />);
    expect(screen.getByTestId("input-type")).toHaveAttribute("type", "email");

    rerender(<Input type="number" data-testid="input-type" />);
    expect(screen.getByTestId("input-type")).toHaveAttribute("type", "number");
  });

  it("triggers onChange handler when typed into", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Input onChange={handleChange} placeholder="Type here" />);
    const input = screen.getByPlaceholderText("Type here");

    await user.type(input, "Hello");

    expect(handleChange).toHaveBeenCalledTimes(5);
    expect(input).toHaveValue("Hello");
  });

  it("handles disabled state correctly", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Input disabled onChange={handleChange} placeholder="Disabled field" />);
    const input = screen.getByPlaceholderText("Disabled field");

    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:cursor-not-allowed", "disabled:opacity-50");

    await user.type(input, "Cannot type");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("merges custom className with default input styles", () => {
    render(<Input className="custom-input-class bg-red-500" placeholder="Custom" />);
    const input = screen.getByPlaceholderText("Custom");
    expect(input).toHaveClass("custom-input-class", "bg-red-500");
  });

  it("forwards ref to HTMLInputElement", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
