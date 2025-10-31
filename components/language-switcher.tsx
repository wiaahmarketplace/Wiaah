/**
 * Language Switcher Component
 *
 * Provides a dropdown menu for users to change the application language.
 * Displays current language flag and name, with all available languages in dropdown.
 *
 * Features:
 * - Visual flag indicators
 * - Current language highlight
 * - Smooth language switching
 * - Responsive design
 */

'use client';

import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/lib/i18n/language-context';
import { supportedLanguages } from '@/lib/i18n/translations';

/**
 * LanguageSwitcher Component
 * Renders a button that opens a dropdown menu for language selection
 */
export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  // Find current language details
  const currentLanguage = supportedLanguages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 h-9 px-3"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden md:inline">{currentLanguage?.flag}</span>
          <span className="hidden lg:inline text-sm">{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            className={`flex items-center gap-3 cursor-pointer ${
              language === lang.code ? 'bg-gray-100' : ''
            }`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className={language === lang.code ? 'font-medium' : ''}>
              {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
