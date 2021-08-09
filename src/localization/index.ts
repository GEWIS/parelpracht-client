import TimeAgo from 'javascript-time-ago';
import nl from 'javascript-time-ago/locale/en';
import en from 'javascript-time-ago/locale/nl';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en_US from './locales/en_US/translations.json';
import nl_NL from './locales/nl_NL/translations.json';

TimeAgo.addLocale(en);
TimeAgo.addLocale(nl);

// eslint-disable-next-line @typescript-eslint/naming-convention
type locales = 'en-US' | 'nl-NL';

const resources = {
  'en-US': {
    translation: en_US,
  },
  'nl-NL': {
    translation: nl_NL,
  },
};

export default i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
  });

export const changeLanguage = (language: locales) => {
  window.location.reload();
  i18n.changeLanguage(language);
};

export const getLanguage = (): locales => {
  return i18n.language as locales;
};

TimeAgo.setDefaultLocale(i18n.language);
