import type { Translations, useTranslation } from "@/hooks/use-translation";

/**
 * Extended translation type that includes optional countries map.
 * Used for language-specific translations that may or may not have country translations.
 */
type TranslationsWithCountries = Translations & {
    countries?: Record<string, string>;
};

type TranslationsWithStages = Translations & {
    stages?: Record<string, string>;
};

/**
 * Translates a stage name using the current language's stage translations.
 * Falls back to the original name if no translation is found.
 */
export function translateStage(
    t: ReturnType<typeof useTranslation>["t"],
    stage: string | null | undefined
): string {
    if (!stage || stage.trim() === "") {
        return "";
    }

    const translations = t as TranslationsWithStages;
    return translations.stages?.[stage] ?? stage;
}

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

    // Type assertion with proper extended type for better safety
    const translations = t as TranslationsWithCountries;
    return translations.countries?.[name] ?? name;
}
