import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import userEvent from "@testing-library/user-event";
import { LanguageSelector } from "./language-selector";

const mockReplace = vi.fn();

vi.mock("next-intl", () => ({
  useLocale: () => "es",
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/lib/i18n/navigation", () => ({
  usePathname: () => "/projects",
  useRouter: () => ({ replace: mockReplace }),
}));

describe("LanguageSelector", () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it("renders all three language buttons", () => {
    render(<LanguageSelector />);
    expect(screen.getByRole("button", { name: /switch to es/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /switch to en/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /switch to fr/i })).toBeInTheDocument();
  });

  it("marks current locale with aria-current", () => {
    render(<LanguageSelector />);
    const esButton = screen.getByRole("button", { name: /switch to es/i });
    expect(esButton).toHaveAttribute("aria-current", "true");
  });

  it("does not mark non-current locale with aria-current", () => {
    render(<LanguageSelector />);
    const enButton = screen.getByRole("button", { name: /switch to en/i });
    expect(enButton).not.toHaveAttribute("aria-current");
  });

  it("has language selector group with aria-label", () => {
    render(<LanguageSelector />);
    expect(screen.getByRole("group", { name: /language selector/i })).toBeInTheDocument();
  });

  it("calls router.replace when clicking a language", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);
    await user.click(screen.getByRole("button", { name: /switch to en/i }));
    expect(mockReplace).toHaveBeenCalledWith("/projects", { locale: "en" });
  });

  it("renders separators as aria-hidden", () => {
    const { container } = render(<LanguageSelector />);
    const separators = container.querySelectorAll("[aria-hidden='true']");
    expect(separators.length).toBe(2); // ES / EN / FR
  });
});
