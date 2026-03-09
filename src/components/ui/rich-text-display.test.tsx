import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { RichTextDisplay } from "./rich-text-display";

describe("RichTextDisplay", () => {
  it("returns null for empty string", () => {
    const { container } = render(<RichTextDisplay html="" />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null for empty paragraph tag", () => {
    const { container } = render(<RichTextDisplay html="<p></p>" />);
    expect(container.innerHTML).toBe("");
  });

  it("renders plain text as paragraphs split by double newlines", () => {
    render(<RichTextDisplay html={"First paragraph\n\nSecond paragraph"} />);
    expect(screen.getByText("First paragraph")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph")).toBeInTheDocument();
  });

  it("renders HTML content with dangerouslySetInnerHTML", () => {
    render(<RichTextDisplay html="<p>Hello <strong>world</strong></p>" />);
    expect(screen.getByText("world")).toBeInTheDocument();
    expect(screen.getByText("world").tagName).toBe("STRONG");
  });

  it("applies custom className", () => {
    const { container } = render(
      <RichTextDisplay html="<p>Test</p>" className="extra-class" />
    );
    expect(container.firstChild).toHaveClass("extra-class");
  });

  it("applies prose classes for HTML content", () => {
    const { container } = render(<RichTextDisplay html="<p>Styled</p>" />);
    expect(container.firstChild).toHaveClass("prose");
  });

  it("applies space-y-4 for plain text content", () => {
    const { container } = render(<RichTextDisplay html="Plain text" />);
    expect(container.firstChild).toHaveClass("space-y-4");
  });
});
