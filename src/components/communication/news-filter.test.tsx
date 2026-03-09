import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import userEvent from "@testing-library/user-event";
import { NewsFilter } from "./news-filter";

describe("NewsFilter", () => {
  const defaultProps = {
    activeFilter: "all" as const,
    onFilterChange: vi.fn(),
    counts: { all: 25, press: 10, radio: 5, tv: 6, video: 4 },
  };

  beforeEach(() => {
    defaultProps.onFilterChange.mockClear();
  });

  it("renders all filter buttons", () => {
    render(<NewsFilter {...defaultProps} />);
    expect(screen.getByRole("button", { name: /todos/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /prensa/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /radio/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /television/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /video/i })).toBeInTheDocument();
  });

  it("marks active filter with aria-pressed=true", () => {
    render(<NewsFilter {...defaultProps} />);
    const allBtn = screen.getByRole("button", { name: /todos/i });
    expect(allBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("marks inactive filters with aria-pressed=false", () => {
    render(<NewsFilter {...defaultProps} />);
    const pressBtn = screen.getByRole("button", { name: /prensa/i });
    expect(pressBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onFilterChange when clicking a filter", async () => {
    const user = userEvent.setup();
    render(<NewsFilter {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /prensa/i }));
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith("press");
  });

  it("displays counts for each filter", () => {
    render(<NewsFilter {...defaultProps} />);
    expect(screen.getByText("(25)")).toBeInTheDocument();
    expect(screen.getByText("(10)")).toBeInTheDocument();
    expect(screen.getByText("(5)")).toBeInTheDocument();
  });

  it("has group role with aria-label", () => {
    render(<NewsFilter {...defaultProps} />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("highlights press filter when active", () => {
    render(<NewsFilter {...defaultProps} activeFilter="press" />);
    const pressBtn = screen.getByRole("button", { name: /prensa/i });
    expect(pressBtn).toHaveAttribute("aria-pressed", "true");
    const allBtn = screen.getByRole("button", { name: /todos/i });
    expect(allBtn).toHaveAttribute("aria-pressed", "false");
  });
});
