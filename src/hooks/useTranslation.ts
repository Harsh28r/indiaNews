// Free translation hook using MyMemory API (no API key needed)
import { useState, useCallback } from 'react';

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

// Cache translations to avoid repeated API calls
const translationCache = new Map<string, string>();

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const translateText = useCallback(async (text: string, targetLang: string): Promise<string> => {
    if (!text || targetLang === 'en') return text;
    
    // Check cache first
    const cacheKey = `${text.slice(0, 50)}_${targetLang}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    try {
      // Split long text into chunks (MyMemory has 500 char limit per request)
      const chunks = splitText(text, 450);
      const translatedChunks: string[] = [];

      for (const chunk of chunks) {
        const response = await fetch(
          `${MYMEMORY_API}?q=${encodeURIComponent(chunk)}&langpair=en|${targetLang}`
        );
        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          translatedChunks.push(data.responseData.translatedText);
        } else {
          translatedChunks.push(chunk); // Fallback to original
        }
        
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 100));
      }

      const result = translatedChunks.join(' ');
      translationCache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }, []);

  const translateContent = useCallback(async (
    content: { title?: string; description?: string; content?: string },
    targetLang: string
  ) => {
    if (targetLang === 'en') return content;
    
    setIsTranslating(true);
    setCurrentLang(targetLang);

    try {
      const [title, description, mainContent] = await Promise.all([
        content.title ? translateText(content.title, targetLang) : '',
        content.description ? translateText(content.description, targetLang) : '',
        content.content ? translateText(stripHtml(content.content), targetLang) : '',
      ]);

      return {
        title: title || content.title,
        description: description || content.description,
        content: mainContent || content.content,
      };
    } finally {
      setIsTranslating(false);
    }
  }, [translateText]);

  return {
    translateText,
    translateContent,
    isTranslating,
    currentLang,
    setCurrentLang,
  };
}

// Helper: Split text into chunks
function splitText(text: string, maxLength: number): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?।])\s+/);
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());

  return chunks;
}

// Helper: Strip HTML tags for translation
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

