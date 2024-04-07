import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import th from "./locales/th.json";

const resources = {
  en: {
    translation: en,
  },
  th: {
    translation: th,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("locale") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});
export default i18n;
