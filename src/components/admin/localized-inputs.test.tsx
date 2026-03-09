import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocalizedInputs } from "./localized-inputs";

describe("LocalizedInputs", () => {
  const defaultProps = {
    field: "title",
    label: "Título",
    values: { es: "Hola", en: "Hello", fr: "Bonjour" },
    onChange: vi.fn(),
  };

  beforeEach(() => {
    defaultProps.onChange.mockClear();
  });

  it("renders label text", () => {
    render(<LocalizedInputs {...defaultProps} />);
    expect(screen.getByText("Título")).toBeInTheDocument();
  });

  it("renders three language tab buttons", () => {
    render(<LocalizedInputs {...defaultProps} />);
    expect(screen.getByRole("button", { name: "ES" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "FR" })).toBeInTheDocument();
  });

  it("shows Spanish value by default", () => {
    render(<LocalizedInputs {...defaultProps} />);
    const input = screen.getByDisplayValue("Hola");
    expect(input).toBeInTheDocument();
  });

  it("switches to English when EN tab is clicked", async () => {
    const user = userEvent.setup();
    render(<LocalizedInputs {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
  });

  it("switches to French when FR tab is clicked", async () => {
    const user = userEvent.setup();
    render(<LocalizedInputs {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: "FR" }));
    expect(screen.getByDisplayValue("Bonjour")).toBeInTheDocument();
  });

  it("calls onChange with active lang and new value", async () => {
    const user = userEvent.setup();
    render(<LocalizedInputs {...defaultProps} />);
    const input = screen.getByDisplayValue("Hola");
    await user.clear(input);
    await user.type(input, "Adiós");
    // onChange called for each keystroke + clear
    expect(defaultProps.onChange).toHaveBeenCalledWith("es", expect.any(String));
  });

  it("shows editing indicator for active language", () => {
    render(<LocalizedInputs {...defaultProps} />);
    expect(screen.getByText("Editando: Espanol")).toBeInTheDocument();
  });

  it("updates editing indicator when switching language", async () => {
    const user = userEvent.setup();
    render(<LocalizedInputs {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getByText("Editando: English")).toBeInTheDocument();
  });

  it("renders textarea when multiline is true", () => {
    render(<LocalizedInputs {...defaultProps} multiline />);
    expect(screen.getByDisplayValue("Hola").tagName).toBe("TEXTAREA");
  });

  it("renders input when multiline is false", () => {
    render(<LocalizedInputs {...defaultProps} />);
    expect(screen.getByDisplayValue("Hola").tagName).toBe("INPUT");
  });

  it("shows required asterisk when required", () => {
    render(<LocalizedInputs {...defaultProps} required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("sets required attribute only for Spanish when required", () => {
    render(<LocalizedInputs {...defaultProps} required />);
    expect(screen.getByDisplayValue("Hola")).toBeRequired();
  });

  it("does not set required for non-Spanish language", async () => {
    const user = userEvent.setup();
    render(<LocalizedInputs {...defaultProps} required />);
    await user.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getByDisplayValue("Hello")).not.toBeRequired();
  });
});
