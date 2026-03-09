import { describe, it, expect } from "vitest";
import { vi } from "vitest";
import { render, screen } from "@/test/utils";
import { Breadcrumbs } from "./breadcrumbs";

// Mock next-intl/navigation Link
vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("Breadcrumbs", () => {
  const items = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Current Page" },
  ];

  it("renders all breadcrumb items", () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Current Page")).toBeInTheDocument();
  });

  it("renders nav with aria-label Breadcrumb", () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("renders links for items with href except the last", () => {
    render(<Breadcrumbs items={items} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[1]).toHaveAttribute("href", "/projects");
  });

  it("marks last item with aria-current=page", () => {
    render(<Breadcrumbs items={items} />);
    const currentPage = screen.getByText("Current Page");
    expect(currentPage).toHaveAttribute("aria-current", "page");
  });

  it("renders separators as aria-hidden", () => {
    const { container } = render(<Breadcrumbs items={items} />);
    const separators = container.querySelectorAll("[aria-hidden='true']");
    expect(separators.length).toBe(2); // 2 separators for 3 items
  });

  it("renders JSON-LD structured data", () => {
    const { container } = render(<Breadcrumbs items={items} />);
    const script = container.querySelector("script[type='application/ld+json']");
    expect(script).not.toBeNull();
    const jsonLd = JSON.parse(script!.textContent!);
    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement).toHaveLength(3);
    expect(jsonLd.itemListElement[0].position).toBe(1);
    expect(jsonLd.itemListElement[0].name).toBe("Home");
  });

  it("renders single item without separators", () => {
    const { container } = render(<Breadcrumbs items={[{ label: "Home" }]} />);
    const separators = container.querySelectorAll("[aria-hidden='true']");
    expect(separators.length).toBe(0);
  });
});
