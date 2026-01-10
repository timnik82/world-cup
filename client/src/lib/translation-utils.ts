import type { useTranslation } from "@/hooks/use-translation";

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
    t: ReturnType<typeof useTranslation>["t"],
    name: string | null | undefined
): string {
    // Handle null, undefined, or empty inputs
    if (!name || name.trim() === "") {
        return "";
    }

    // Use Record<string, string> instead of 'as any' for better type safety
    const countries = (t as { countries?: Record<string, string> }).countries;
    return countries?.[name] || name;
}
