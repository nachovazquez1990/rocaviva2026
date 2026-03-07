"use server";

import { createClient } from "@/lib/supabase/server";

export interface BookFormState {
  success: boolean;
  error: string | null;
  bookId: string | null;
}

export async function submitBookDownload(
  _prevState: BookFormState,
  formData: FormData
): Promise<BookFormState> {
  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const interest = formData.get("interest") as string | null;
  const profession = formData.get("profession") as string | null;
  const comments = formData.get("comments") as string | null;
  const bookId = formData.get("bookId") as string | null;

  // Server-side validation
  if (!name || name.trim().length < 2) {
    return { success: false, error: "name", bookId: null };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "email", bookId: null };
  }

  if (!interest || !["personal", "professional", "gift"].includes(interest)) {
    return { success: false, error: "interest", bookId: null };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("book_downloads").insert({
      book_id: bookId || null,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      interest: interest as "personal" | "professional" | "gift",
      profession: profession?.trim() || null,
      comments: comments?.trim() || null,
    });

    if (error) {
      console.error("Error saving book download:", error.message);
      return { success: false, error: "server", bookId: null };
    }

    return { success: true, error: null, bookId };
  } catch {
    return { success: false, error: "server", bookId: null };
  }
}
