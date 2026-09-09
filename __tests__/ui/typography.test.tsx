import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/app/context/theme-context";
import {
  PageHeading,
  SectionHeading,
  SubHeading,
  Body,
  Eyebrow,
  Quote,
  Section,
  ProseContainer,
  CardContainer,
  CardGrid,
  Divider,
} from "@/components/ui/typography";

function renderWithTheme(ui: React.ReactElement, initialTheme: "light" | "dark" = "light") {
  localStorage.setItem("theme", initialTheme);
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Typography & Layout Primitives (components/ui/typography.tsx)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("PageHeading", () => {
    it("renders default h1 with center alignment and xl size", () => {
      renderWithTheme(<PageHeading>Main Title</PageHeading>);
      const heading = screen.getByRole("heading", { level: 1, name: /main title/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H1");
      expect(heading).toHaveClass("text-center", "font-bold");
    });

    it("supports as polymorphic prop and left alignment", () => {
      renderWithTheme(
        <PageHeading as="h2" align="left" size="sm" className="custom-heading">
          Custom Sub Title
        </PageHeading>
      );
      const heading = screen.getByRole("heading", { level: 2, name: /custom sub title/i });
      expect(heading.tagName).toBe("H2");
      expect(heading).toHaveClass("custom-heading");
      expect(heading).not.toHaveClass("text-center");
    });
  });

  describe("SectionHeading", () => {
    it("renders h2 section heading", () => {
      renderWithTheme(<SectionHeading>Section Title</SectionHeading>);
      const heading = screen.getByRole("heading", { level: 2, name: /section title/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H2");
      expect(heading).toHaveClass("font-bold");
    });
  });

  describe("SubHeading", () => {
    it("renders h3 subsection heading", () => {
      renderWithTheme(<SubHeading>Subsection Title</SubHeading>);
      const heading = screen.getByRole("heading", { level: 3, name: /subsection title/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H3");
      expect(heading).toHaveClass("font-semibold");
    });
  });

  describe("Body", () => {
    it("renders paragraph text with base size", () => {
      renderWithTheme(<Body>Body text content</Body>);
      const body = screen.getByText(/body text content/i);
      expect(body.tagName).toBe("P");
      expect(body).toHaveClass("leading-relaxed");
    });

    it("supports muted color, custom size, and polymorphic as tag", () => {
      renderWithTheme(
        <Body as="span" size="sm" muted>
          Muted Span Text
        </Body>
      );
      const span = screen.getByText(/muted span text/i);
      expect(span.tagName).toBe("SPAN");
    });
  });

  describe("Eyebrow", () => {
    it("renders uppercase small tracking text", () => {
      renderWithTheme(<Eyebrow>CATEGORY LABEL</Eyebrow>);
      const eyebrow = screen.getByText(/category label/i);
      expect(eyebrow).toHaveClass("tracking-[0.3em]");
    });
  });

  describe("Quote", () => {
    it("renders blockquote element with left border and italic font", () => {
      renderWithTheme(<Quote>Wisdom Quote</Quote>);
      const quote = screen.getByText(/wisdom quote/i);
      expect(quote.tagName).toBe("BLOCKQUOTE");
      expect(quote).toHaveClass("italic", "border-l-2");
    });
  });

  describe("Section & Layout Containers", () => {
    it("renders Section with specified width and padding options", () => {
      const { container } = renderWithTheme(
        <Section width="prose" padding="compact" className="test-section">
          <div>Section Content</div>
        </Section>
      );

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass("test-section", "py-6");

      const innerDiv = section?.firstElementChild;
      expect(innerDiv).toHaveClass("max-w-3xl", "mx-auto");
    });

    it("renders ProseContainer with max-w-3xl", () => {
      const { container } = renderWithTheme(
        <ProseContainer className="custom-prose">Prose Content</ProseContainer>
      );
      expect(container.firstChild).toHaveClass("max-w-3xl", "mx-auto", "custom-prose");
    });

    it("renders CardContainer with glassmorphism classes", () => {
      const { container } = renderWithTheme(
        <CardContainer padding="loose">Card Content</CardContainer>
      );
      expect(container.firstChild).toHaveClass("rounded-lg", "border", "p-6");
    });

    it("renders CardGrid with 2, 3, and 4 columns", () => {
      const { rerender, container } = renderWithTheme(
        <CardGrid cols={2} gap="compact">
          <div>Item 1</div>
          <div>Item 2</div>
        </CardGrid>
      );
      expect(container.firstChild).toHaveClass("md:grid-cols-2", "gap-3");

      rerender(
        <ThemeProvider>
          <CardGrid cols={4} gap="normal">
            <div>Item</div>
          </CardGrid>
        </ThemeProvider>
      );
      expect(container.firstChild).toHaveClass("md:grid-cols-4", "gap-4");
    });

    it("renders Divider with alignment and width variants", () => {
      const { container, rerender } = renderWithTheme(
        <Divider width="sm" align="center" className="custom-div" />
      );
      expect(container.firstChild).toHaveClass("w-12", "mx-auto", "custom-div");

      rerender(
        <ThemeProvider>
          <Divider width="lg" align="left" />
        </ThemeProvider>
      );
      expect(container.firstChild).toHaveClass("w-32", "ml-0");
    });
  });

  describe("Theme adaptation", () => {
    it("applies dark mode color classes when theme is dark", () => {
      renderWithTheme(<PageHeading>Dark Title</PageHeading>, "dark");
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("text-white");
    });

    it("applies light mode color classes when theme is light", () => {
      renderWithTheme(<PageHeading>Light Title</PageHeading>, "light");
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("text-gray-900");
    });
  });
});
