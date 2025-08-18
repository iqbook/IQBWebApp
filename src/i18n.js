// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(initReactI18next) // connects with React
  .use(LanguageDetector)  // detects the user language
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          description: "Desc"
        }
      },
      fr: {
        translation: {
          welcome: "Bienvenue",
          description: "Ceci "
        }
      },
      pt: {
        translation: {
          welcome: "Bem-vindo",
          description: "Este é um exemplo simples"
        }
      }
    },
    fallbackLng: 'en', // default language
    interpolation: {
      escapeValue: false // react already handles escaping
    }
  });

export default i18n;
