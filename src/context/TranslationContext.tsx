import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';
const translationCache = new Map<string, string>();

interface TranslationContextType {
  currentLang: string;
  setLanguage: (lang: string) => void;
  translateText: (text: string) => Promise<string>;
  isTranslating: boolean;
  resetToEnglish: () => void;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('preferredLanguage') || 'en';
  });
  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = useCallback((lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('preferredLanguage', lang);
  }, []);

  const resetToEnglish = useCallback(() => {
    setLanguage('en');
  }, [setLanguage]);

  const translateText = useCallback(async (text: string): Promise<string> => {
    if (!text || currentLang === 'en') return text;
    
    const cacheKey = `${text.slice(0, 100)}_${currentLang}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    setIsTranslating(true);
    try {
      // Split into chunks for long text
      const chunks = splitText(text, 450);
      const results: string[] = [];

      for (const chunk of chunks) {
        const res = await fetch(
          `${MYMEMORY_API}?q=${encodeURIComponent(chunk)}&langpair=en|${currentLang}`
        );
        const data = await res.json();
        
        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          results.push(data.responseData.translatedText);
        } else {
          results.push(chunk);
        }
        await new Promise(r => setTimeout(r, 50));
      }

      const translated = results.join(' ');
      translationCache.set(cacheKey, translated);
      return translated;
    } catch (err) {
      console.error('Translation error:', err);
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLang]);

  return (
    <TranslationContext.Provider value={{
      currentLang,
      setLanguage,
      translateText,
      isTranslating,
      resetToEnglish,
    }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslationContext must be inside TranslationProvider');
  return ctx;
}

function splitText(text: string, max: number): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?।])\s+/);
  let curr = '';
  for (const s of sentences) {
    if ((curr + s).length > max) {
      if (curr) chunks.push(curr.trim());
      curr = s;
    } else {
      curr += (curr ? ' ' : '') + s;
    }
  }
  if (curr) chunks.push(curr.trim());
  return chunks;
}

