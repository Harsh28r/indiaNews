// Auto-translating text component
import { useState, useEffect } from 'react';
import { useTranslationContext } from '../context/TranslationContext';

interface TranslatedTextProps {
  text: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div';
  className?: string;
}

export default function TranslatedText({ text, as: Tag = 'span', className }: TranslatedTextProps) {
  const { currentLang, translateText } = useTranslationContext();
  const [translated, setTranslated] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentLang === 'en') {
      setTranslated(text);
      return;
    }

    let cancelled = false;
    setLoading(true);

    translateText(text).then(result => {
      if (!cancelled) {
        setTranslated(result);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [text, currentLang, translateText]);

  return (
    <Tag className={`${className || ''} ${loading ? 'animate-pulse' : ''}`}>
      {translated}
    </Tag>
  );
}

// Hook version for more control
export function useTranslatedText(text: string) {
  const { currentLang, translateText } = useTranslationContext();
  const [translated, setTranslated] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentLang === 'en' || !text) {
      setTranslated(text);
      return;
    }

    let cancelled = false;
    setLoading(true);

    translateText(text).then(result => {
      if (!cancelled) {
        setTranslated(result);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [text, currentLang, translateText]);

  return { translated, loading, isTranslated: currentLang !== 'en' };
}

