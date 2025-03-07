import i18n from "i18next";
import { initReactI18next } from "react-i18next"; 
import LanguageDetector from "i18next-browser-languagedetector";
import en from './locales/en.json';
import hu from './locales/hu.json';
import TimeAgo from 'javascript-time-ago';
import huLocale from 'javascript-time-ago/locale/hu';
import enLocale from 'javascript-time-ago/locale/en';

// Nyelv beállítása a localStorage-ból (ha elérhető)
const language = localStorage.getItem("language") || "hu"; // Alapértelmezett: 'hu'

// A nyelv beállítása a TimeAgo számára
const selectedLocale = language === "hu" ? huLocale : enLocale;
TimeAgo.addDefaultLocale(selectedLocale);

// Nyelv inicializálása
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: en
      },
      hu: {
        translation: hu
      }
    },
    lng: language, // A kiválasztott nyelv
    fallbackLng: 'hu', // Ha nem található nyelv, akkor magyar
    interpolation: {
      escapeValue: false // React használatakor ne kelljen menekíteni a karaktereket
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'], // Először localStorage-t használjunk
      caches: ['localStorage'], // Nyelv tárolása localStorage-ban
    }
  });

// Figyeljük a nyelv változását
i18n.on('languageChanged', (lng) => {
  // A nyelv változtatásakor állítsuk be a megfelelő TimeAgo nyelvet
  const newLocale = lng === "hu" ? huLocale : enLocale;
  TimeAgo.addDefaultLocale(newLocale);
  
  // Az oldal frissítése a nyelvváltoztatás után
  window.location.reload(); // Az oldal újratöltése
});

export default i18n;
