import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string (YYYY-MM-DD or DD/MM/YYYY) for display.
 * ES/FR: dd/mm/aaaa | EN: mm/dd/yyyy
 */
export function formatDate(date: string, locale: string): string {
  let day: string, month: string, year: string;

  if (date.includes("-")) {
    // ISO format: YYYY-MM-DD
    [year, month, day] = date.split("-");
  } else if (date.includes("/")) {
    // Already dd/mm/yyyy
    [day, month, year] = date.split("/");
  } else {
    return date;
  }

  if (locale === "en") {
    return `${month}/${day}/${year}`;
  }
  return `${day}/${month}/${year}`;
}
