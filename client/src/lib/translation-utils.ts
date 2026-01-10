import type { Translations } from "@/hooks/use-translation";

/**
 * Extended translation type that includes optional countries map.
 * Used for language-specific translations that may or may not have country translations.
 */
type TranslationsWithCountries = Translations & {
    countries?: Record<string, string>;
};

/**
 * Translates a country name using the current language's country translations.
 * Falls back to the original name if no translation is found.
 * Handles null, undefined, and empty string inputs gracefully.
 * 
 * @param t - Translation object from useTranslation hook
 * @param name - Country name to translate (can be null, undefined, or empty)
 * @returns Translated country name, original name, or empty string as fallback
 * 
 * @example
 * const translated = translateCountry(t, "Brazil"); // Returns "Brasil" for pt, "Бразилия" for ru, "Brazil" for en
 * const safe = translateCountry(t, null); // Returns ""
 */
export function translateCountry(
    t: TranslationsWithCountries,
    name: string | null | undefined
): string {
    // Handle null, undefined, or empty inputs
    if (!name || name.trim() === "") {
        return "";
    }

    return t.countries?.[name] ?? name;
}
