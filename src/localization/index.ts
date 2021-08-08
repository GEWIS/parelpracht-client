import TimeAgo from 'javascript-time-ago';
import nl from 'javascript-time-ago/locale/en';
import en from 'javascript-time-ago/locale/nl';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en_US from './locales/en-US.json';
import nl_NL from './locales/nl-NL.json';

TimeAgo.addLocale(en);
TimeAgo.addLocale(nl);

// eslint-disable-next-line @typescript-eslint/naming-convention
type locales = 'en_US' | 'nl_NL';

const resources = {
  en_US,
  nl_NL,
};

export default i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en_US',
    interpolation: {
      escapeValue: false,
    },
  });

export const changeLanguage = (language: locales) => {
  window.location.reload();
  switch (language) {
    case 'en_US':
      i18n.changeLanguage('en_US');
      break;
    case 'nl_NL':
      i18n.changeLanguage('nl_NL');
      break;
    default:
      throw new TypeError(`Unknown i18n translation language: ${language}`);
  }
};

export const getLanguage = (): locales => {
  return i18n.language as locales;
};

switch (i18n.language) {
  case 'nl_NL': TimeAgo.setDefaultLocale('nl-NL'); break;
  case 'en_US':
  default:
    TimeAgo.setDefaultLocale('en-US'); break;
}
