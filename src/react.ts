import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { I18n, type Translations } from './index';

interface I18nContextValue {
  i18n: I18n;
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  default?: string;
  translations: Record<string, Translations>;
  children: ReactNode;
  storageKey?: string;
}

export function I18nProvider({
  default: defaultLang = 'en',
  translations,
  children,
  storageKey = 'lang',
}: I18nProviderProps) {
  const [i18n] = useState(() => {
    const i = new I18n({ default: defaultLang });
    for (const [lang, data] of Object.entries(translations)) {
      i.addTranslations(lang, data);
    }
    const saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (saved && saved in translations) {
      i.setLang(saved);
    }
    return i;
  });

  const [lang, setLangState] = useState(i18n.current);

  const setLang = useCallback((newLang: string) => {
    i18n.setLang(newLang);
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newLang);
    }
  }, [i18n, storageKey]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => i18n.t(key, params),
    [i18n, lang]
  );

  return (
    <I18nContext.Provider value={{ i18n, lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export function useLang(): string {
  return useI18n().lang;
}

export function useSetLang(): (lang: string) => void {
  return useI18n().setLang;
}
