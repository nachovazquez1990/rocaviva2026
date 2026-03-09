import { describe, it, expect } from "vitest";
import { locales, defaultLocale, localeNames, type Locale } from "./config";

describe("i18n config", () => {
  it("has exactly three locales", () => {
    expect(locales).toHaveLength(3);
  });

  it("includes es, en, and fr", () => {
    expect(locales).toContain("es");
    expect(locales).toContain("en");
    expect(locales).toContain("fr");
  });

  it("has Spanish as the default locale", () => {
    expect(defaultLocale).toBe("es");
  });

  it("has locale names for all locales", () => {
    locales.forEach((locale) => {
      expect(localeNames[locale]).toBeDefined();
      expect(typeof localeNames[locale]).toBe("string");
    });
  });

  it("has correct locale name labels", () => {
    expect(localeNames.es).toBe("Espanol");
    expect(localeNames.en).toBe("English");
    expect(localeNames.fr).toBe("Francais");
  });

  it("Locale type is correctly derived from locales array", () => {
    const testLocale: Locale = "es";
    expect(locales).toContain(testLocale);
  });
});
