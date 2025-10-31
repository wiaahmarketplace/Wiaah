/**
 * Language Context Provider
 *
 * This context manages the application's language state and provides
 * translation utilities throughout the component tree.
 *
 * Features:
 * - Auto-detection of browser language
 * - Persistent language preference (localStorage)
 * - Dynamic language switching
 * - Translation helper function
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, defaultLanguage, supportedLanguages } from './translations';

// Type for language codes
type LanguageCode = 'en' | 'fr' | 'es' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ar';

// Context interface
interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof typeof translations) => string;
  isRTL: boolean;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Detects the user's preferred language from browser settings
 * Falls back to default language if not supported
 */
function detectBrowserLanguage(): LanguageCode {
  if (typeof window === 'undefined') return defaultLanguage as LanguageCode;

  // Get browser language
  const browserLang = navigator.language.split('-')[0];

  // Check if it's supported
  const supported = supportedLanguages.find(lang => lang.code === browserLang);

  return (supported ? browserLang : defaultLanguage) as LanguageCode;
}

/**
 * Language Provider Component
 * Wraps the app and provides language context to all children
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize language state with auto-detection
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguage as LanguageCode);
  const [mounted, setMounted] = useState(false);

  // Check if language is RTL (Right-to-Left)
  const isRTL = language === 'ar';

  useEffect(() => {
    setMounted(true);

    // Try to get saved language from localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage') as LanguageCode;

    if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
      // Use saved language
      setLanguageState(savedLanguage);
    } else {
      // Auto-detect browser language
      const detectedLanguage = detectBrowserLanguage();
      setLanguageState(detectedLanguage);
      localStorage.setItem('preferredLanguage', detectedLanguage);
    }
  }, []);

  // Update language and save to localStorage
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);

    // Update HTML dir attribute for RTL languages
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  /**
   * Translation helper function
   * Returns translated text for a given key in current language
   *
   * @param key - Translation key from translations object
   * @returns Translated string
   */
  const t = (key: keyof typeof translations): string => {
    const translation = translations[key];
    if (!translation) return key as string;

    return translation[language] || translation[defaultLanguage as LanguageCode] || key as string;
  };

  // Apply RTL direction on mount
  useEffect(() => {
    if (mounted && typeof document !== 'undefined') {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, isRTL, mounted]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to use language context
 * Must be used within LanguageProvider
 *
 * @returns Language context object with language state and utilities
 */
export function useLanguage() {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}
