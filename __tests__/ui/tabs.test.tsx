import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

describe("Tabs Component (components/ui/tabs.tsx)", () => {
  it("renders tabs list, triggers, and displays default active content", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content for Tab 1</TabsContent>
        <TabsContent value="tab2">Content for Tab 2</TabsContent>
      </Tabs>
    );

    const trigger1 = screen.getByRole("tab", { name: "Tab 1" });
    const trigger2 = screen.getByRole("tab", { name: "Tab 2" });

    expect(trigger1).toHaveAttribute("data-state", "active");
    expect(trigger2).toHaveAttribute("data-state", "inactive");

    expect(screen.getByText("Content for Tab 1")).toBeInTheDocument();
    expect(screen.queryByText("Content for Tab 2")).not.toBeInTheDocument();
  });

  it("switches tab content when an inactive tab trigger is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content for Tab 1</TabsContent>
        <TabsContent value="tab2">Content for Tab 2</TabsContent>
      </Tabs>
    );

    const trigger2 = screen.getByRole("tab", { name: "Tab 2" });
    await user.click(trigger2);

    expect(trigger2).toHaveAttribute("data-state", "active");
    expect(screen.queryByText("Content for Tab 1")).not.toBeInTheDocument();
    expect(screen.getByText("Content for Tab 2")).toBeInTheDocument();
  });

  it("does not switch tabs when clicking a disabled tab trigger", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>
            Tab 2 Disabled
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    const trigger2 = screen.getByRole("tab", { name: "Tab 2 Disabled" });
    expect(trigger2).toBeDisabled();

    await user.click(trigger2);

    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
  });

  it("applies custom classNames to tabs subcomponents", () => {
    render(
      <Tabs defaultValue="tab1" className="custom-tabs">
        <TabsList className="custom-list">
          <TabsTrigger value="tab1" className="custom-trigger">
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content">
          Content
        </TabsContent>
      </Tabs>
    );

    expect(screen.getByRole("tablist")).toHaveClass("custom-list");
    expect(screen.getByRole("tab")).toHaveClass("custom-trigger");
    expect(screen.getByRole("tabpanel")).toHaveClass("custom-content");
  });
});
