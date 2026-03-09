import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import userEvent from "@testing-library/user-event";
import { Input, Textarea } from "./input";

describe("Input", () => {
  it("renders without label", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders with label and links it via htmlFor", () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  it("generates id from label", () => {
    render(<Input label="Full Name" />);
    expect(screen.getByLabelText("Full Name")).toHaveAttribute("id", "full-name");
  });

  it("uses provided id over generated one", () => {
    render(<Input label="Name" id="custom-id" />);
    expect(screen.getByLabelText("Name")).toHaveAttribute("id", "custom-id");
  });

  it("shows error message with alert role", () => {
    render(<Input label="Email" error="Invalid email" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Invalid email");
  });

  it("sets aria-invalid when error is present", () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("links error to input via aria-describedby", () => {
    render(<Input label="Email" id="email" error="Bad email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    expect(screen.getByRole("alert")).toHaveAttribute("id", "email-error");
  });

  it("does not show error when none provided", () => {
    render(<Input label="Name" />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("accepts user input", async () => {
    const user = userEvent.setup();
    render(<Input label="Name" />);
    const input = screen.getByLabelText("Name");
    await user.type(input, "Hello");
    expect(input).toHaveValue("Hello");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement | null>;
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

describe("Textarea", () => {
  it("renders with label", () => {
    render(<Textarea label="Comments" />);
    const textarea = screen.getByLabelText("Comments");
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("shows error message with alert role", () => {
    render(<Textarea label="Bio" error="Too short" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Too short");
  });

  it("sets aria-invalid when error exists", () => {
    render(<Textarea label="Bio" error="Required" />);
    expect(screen.getByLabelText("Bio")).toHaveAttribute("aria-invalid", "true");
  });

  it("accepts user input", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Notes" />);
    const textarea = screen.getByLabelText("Notes");
    await user.type(textarea, "Some notes");
    expect(textarea).toHaveValue("Some notes");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLTextAreaElement | null>;
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
