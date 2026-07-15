export type Translations = Record<string, string | Record<string, unknown>>;

export interface I18nOptions {
  default?: string;
  fallback?: string;
}

export class I18n {
  default: string;
  fallback: string;
  current: string;
  private _translations: Record<string, Translations> = {};

  constructor(options: I18nOptions = {}) {
    this.default = options.default || 'en';
    this.fallback = options.fallback || this.default;
    this.current = this.default;
  }

  addTranslations(lang: string, data: Translations): void {
    this._translations[lang] = data;
  }

  setLang(lang: string): void {
    if (lang in this._translations) {
      this.current = lang;
    }
  }

  langs(): string[] {
    return Object.keys(this._translations);
  }

  t(key: string, params?: Record<string, string | number>): string {
    let val: unknown = this._translations[this.current];
    for (const part of key.split('.')) {
      if (val && typeof val === 'object') {
        val = (val as Record<string, unknown>)[part];
      } else {
        val = undefined;
        break;
      }
    }

    if (val === undefined || typeof val !== 'string') {
      val = this._translations[this.fallback];
      for (const part of key.split('.')) {
        if (val && typeof val === 'object') {
          val = (val as Record<string, unknown>)[part];
        } else {
          return key;
        }
      }
      if (typeof val !== 'string') return key;
    }

    if (params) {
      return val.replace(/\{(\w+)\}/g, (_, k) =>
        k in params ? String(params[k]) : `{${k}}`
      );
    }
    return val;
  }
}

export default I18n;
