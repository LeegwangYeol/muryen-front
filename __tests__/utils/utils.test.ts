import { cn } from "@/lib/utils";

describe("cn utility function", () => {
  it("merges standard class strings correctly", () => {
    const result = cn("flex", "items-center", "justify-between");
    expect(result).toBe("flex items-center justify-between");
  });

  it("handles conditional classes and falsy values", () => {
    const isHidden = false;
    const isVisible = true;
    const result = cn(
      "base-class",
      isHidden && "hidden",
      isVisible && "block",
      undefined,
      null,
      false,
      ""
    );
    expect(result).toBe("base-class block");
  });

  it("handles arrays and object conditions", () => {
    const result = cn(
      ["btn", "btn-primary"],
      { "is-active": true, "is-disabled": false },
      "extra"
    );
    expect(result).toBe("btn btn-primary is-active extra");
  });

  it("resolves conflicting Tailwind classes using tailwind-merge", () => {
    // Padding conflict: px-4 should override px-2
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");

    // Background color conflict: bg-blue-500 should override bg-red-500
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");

    // Font size conflict: text-lg should override text-sm
    expect(cn("text-sm", "text-lg")).toBe("text-lg");

    // Margin conflict with responsive prefixes
    expect(cn("m-2", "m-4", "md:m-8")).toBe("m-4 md:m-8");
  });

  it("returns an empty string when given empty or falsy inputs", () => {
    expect(cn()).toBe("");
    expect(cn(null, undefined, false)).toBe("");
  });
});
