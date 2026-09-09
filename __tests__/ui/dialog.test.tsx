import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

describe("Dialog Component (components/ui/dialog.tsx)", () => {
  it("does not render dialog content when closed", () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description text</DialogDescription>
          <p>Dialog Body</p>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByRole("button", { name: /open dialog/i })).toBeInTheDocument();
    expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Dialog Body")).not.toBeInTheDocument();
  });

  it("opens dialog content when trigger button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Modal</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modal Headline</DialogTitle>
            <DialogDescription>Modal Description</DialogDescription>
          </DialogHeader>
          <div>Modal Body Text</div>
          <DialogFooter>
            <DialogClose asChild>
              <button>Cancel</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: /open modal/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Modal Headline")).toBeInTheDocument();
    expect(screen.getByText("Modal Description")).toBeInTheDocument();
    expect(screen.getByText("Modal Body Text")).toBeInTheDocument();
  });

  it("closes dialog when close button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Modal</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Modal Title</DialogTitle>
          <DialogDescription>Modal description</DialogDescription>
          <DialogClose asChild>
            <button>Close Button</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: /open modal/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close button/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("works in controlled mode with open and onOpenChange props", async () => {
    const user = userEvent.setup();
    const handleOpenChange = jest.fn();

    const { rerender } = render(
      <Dialog open={false} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogTitle>Controlled Modal</DialogTitle>
          <DialogDescription>Controlled description</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Dialog open={true} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogTitle>Controlled Modal</DialogTitle>
          <DialogDescription>Controlled description</DialogDescription>
          <DialogClose asChild>
            <button>Dismiss</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Controlled Modal")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
