import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageStore, type Language } from "@/store/language";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const languages: { code: Language; flag: string }[] = [
  { code: "en", flag: "GB" },
  { code: "ru", flag: "RU" },
];

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="min-h-12 px-4 text-kid-base font-semibold rounded-xl gap-2"
          data-testid="button-language-toggle"
          aria-label={language === "en" ? "Switch language" : "Сменить язык"}
        >
          <Globe className="w-5 h-5" />
          <span className="hidden sm:inline">{t.language[language]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "text-kid-base font-medium cursor-pointer",
              language === lang.code && "bg-accent"
            )}
            data-testid={`menu-language-${lang.code}`}
          >
            <span className="mr-2">{getFlagEmoji(lang.flag)}</span>
            {t.language[lang.code]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
