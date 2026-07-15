# ts-i18n

Lightweight i18n module with TypeScript core + React/Vue adapters. JSON translations, localStorage persistence, zero dependencies.

## Install

```bash
npm install ts-i18n
```

Or copy `src/` + `translations/` into your project.

## Core (any framework)

```typescript
import { I18n } from 'ts-i18n';

const i18n = new I18n({ default: 'ru' });

i18n.addTranslations('ru', { nav: { home: 'Главная' } });
i18n.addTranslations('en', { nav: { home: 'Home' } });

i18n.t('nav.home');       // -> "Главная"
i18n.setLang('en');
i18n.t('nav.home');       // -> "Home"

// With params
i18n.addTranslations('ru', { auth: { welcome: 'Привет, {name}!' } });
i18n.t('auth.welcome', { name: 'Alex' });  // -> "Привет, Alex!"
```

## React

```tsx
import { I18nProvider, useI18n } from 'ts-i18n/react';
import ru from 'ts-i18n/translations/ru.json';
import en from 'ts-i18n/translations/en.json';

function App() {
  return (
    <I18nProvider default="ru" translations={{ ru, en }}>
      <Page />
    </I18nProvider>
  );
}

function Page() {
  const { t, lang, setLang } = useI18n();
  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <button onClick={() => setLang('en')}>EN</button>
      <button onClick={() => setLang('ru')}>RU</button>
    </div>
  );
}
```

## Vue

```typescript
import { createI18n } from 'ts-i18n/vue';
import ru from 'ts-i18n/translations/ru.json';
import en from 'ts-i18n/translations/en.json';

const { plugin, t, setLang } = createI18n({
  default: 'ru',
  translations: { ru, en },
});

app.use(plugin);
```

```vue
<template>
  <h1>{{ $t('nav.home') }}</h1>
</template>
```

## Vanilla JS / browser

```typescript
import { I18n } from 'ts-i18n';

const i18n = new I18n({ default: 'en' });
i18n.addTranslations('en', { hello: 'Hello' });
i18n.addTranslations('ru', { hello: 'Привет' });

// Set from URL param
const params = new URLSearchParams(location.search);
const lang = params.get('lang');
if (lang) i18n.setLang(lang);

// Persist to localStorage
const saved = localStorage.getItem('lang');
if (saved) i18n.setLang(saved);

// Listen for changes
document.querySelectorAll('[data-lang]').forEach(el => {
  el.addEventListener('click', () => {
    const newLang = el.getAttribute('data-lang')!;
    i18n.setLang(newLang);
    localStorage.setItem('lang', newLang);
    render(); // re-render your app
  });
});
```

## Translation files

```json
{
  "_lang": "ru",
  "nav": { "home": "Главная" },
  "auth": { "welcome": "Привет, {name}!" }
}
```

Nested keys with dot notation: `t('nav.home')`.

## License

MIT
