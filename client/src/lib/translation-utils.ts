import type { useTranslation } from "@/hooks/use-translation";

/**
 * Translates a country name using the current language's country translations.
 * Falls back to the original name if no translation is found.
 * 
 * @param t - Translation object from useTranslation hook
 * @param name - Country name to translate
 * @returns Translated country name or original name as fallback
 */
export function translateCountry(
    t: ReturnType<typeof useTranslation>["t"],
    name: string
): string {
    // Use Record<string, string> instead of 'as any' for better type safety
    const countries = (t as { countries?: Record<string, string> }).countries;
    return countries?.[name] || name;
}
