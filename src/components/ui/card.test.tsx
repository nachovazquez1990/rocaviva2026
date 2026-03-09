import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { Card } from "./card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders as div by default", () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId("card").tagName).toBe("DIV");
  });

  it("renders as article when specified", () => {
    render(<Card as="article" data-testid="card">Content</Card>);
    expect(screen.getByTestId("card").tagName).toBe("ARTICLE");
  });

  it("has hover shadow by default", () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId("card").className).toContain("hover:shadow-lg");
  });

  it("removes hover shadow when hoverable is false", () => {
    render(<Card hoverable={false} data-testid="card">Content</Card>);
    expect(screen.getByTestId("card").className).not.toContain("hover:shadow-lg");
  });

  it("applies custom className", () => {
    render(<Card className="my-custom" data-testid="card">Content</Card>);
    expect(screen.getByTestId("card")).toHaveClass("my-custom");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
