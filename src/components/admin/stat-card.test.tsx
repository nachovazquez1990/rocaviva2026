import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "./stat-card";
import { BarChart3 } from "lucide-react";

describe("StatCard", () => {
  const defaultProps = {
    label: "Total Views",
    value: 1234,
    icon: BarChart3,
  };

  it("renders label and value", () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText("Total Views")).toBeInTheDocument();
    expect(screen.getByText("1234")).toBeInTheDocument();
  });

  it("renders string value", () => {
    render(<StatCard {...defaultProps} value="5.2K" />);
    expect(screen.getByText("5.2K")).toBeInTheDocument();
  });

  it("renders trend when provided", () => {
    render(<StatCard {...defaultProps} trend="+12% vs last week" />);
    expect(screen.getByText("+12% vs last week")).toBeInTheDocument();
  });

  it("does not render trend when not provided", () => {
    const { container } = render(<StatCard {...defaultProps} />);
    const trendElements = container.querySelectorAll(".text-green-600, .text-red-500");
    expect(trendElements.length).toBe(0);
  });

  it("applies green color for upward trend", () => {
    render(<StatCard {...defaultProps} trend="+5%" trendUp />);
    expect(screen.getByText("+5%")).toHaveClass("text-green-600");
  });

  it("applies red color for downward trend", () => {
    render(<StatCard {...defaultProps} trend="-3%" trendUp={false} />);
    expect(screen.getByText("-3%")).toHaveClass("text-red-500");
  });

  it("applies custom className", () => {
    const { container } = render(<StatCard {...defaultProps} className="w-full" />);
    expect(container.firstChild).toHaveClass("w-full");
  });
});
