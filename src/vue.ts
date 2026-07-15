import { inject, computed, ref, type Ref, type App, type Plugin } from 'vue';
import { I18n, type Translations } from './index';

export interface VueI18nOptions {
  default?: string;
  translations: Record<string, Translations>;
  storageKey?: string;
}

export function createI18n(options: VueI18nOptions) {
  const { default: defaultLang = 'en', translations, storageKey = 'lang' } = options;

  const i18n = new I18n({ default: defaultLang });
  for (const [lang, data] of Object.entries(translations)) {
    i18n.addTranslations(lang, data);
  }

  const saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
  if (saved && saved in translations) {
    i18n.setLang(saved);
  }

  const lang = ref(i18n.current);

  const setLang = (newLang: string) => {
    i18n.setLang(newLang);
    lang.value = newLang;
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newLang);
    }
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    void lang.value;
    return i18n.t(key, params);
  };

  const plugin: Plugin = {
    install(app: App) {
      app.provide('i18n', { i18n, lang, setLang, t });
      app.config.globalProperties.$t = t;
      app.config.globalProperties.$lang = lang;
      app.config.globalProperties.$setLang = setLang;
    },
  };

  return { i18n, lang, setLang, t, plugin };
}

export function useI18n() {
  const ctx = inject<I18nContext>('i18n');
  if (!ctx) throw new Error('useI18n must be used after app.use(i18n.plugin)');
  return ctx;
}

interface I18nContext {
  i18n: I18n;
  lang: Ref<string>;
  setLang: (lang: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}
