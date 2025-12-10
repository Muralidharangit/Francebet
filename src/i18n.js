import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
// 1. Import the Language Detector
import LanguageDetector from 'i18next-browser-languagedetector'; 

i18n
  .use(HttpBackend) // Load translations from the public folder
  // 2. Use the Language Detector plugin
  .use(LanguageDetector) 
  .use(initReactI18next) // Integrate i18next with React
  .init({
    // We remove 'lng: "en"' because the detector will handle the initial language.
    // If no language is detected, it will fall back to 'fallbackLng'.
    
    // Fallback language if a key is missing or no language is detected
    fallbackLng: 'en', 
    
    // Enable debug logging
    debug: true,

    // 3. Configuration for the Language Detector
    detection: {
      // Order of detection: 
      // 1. Check 'localStorage' for a saved key
      // 2. Check the browser's language setting ('navigator')
      order: ['localStorage', 'navigator'], 
      
      // Key used in localStorage to store the user's preferred language
      lookupLocalStorage: 'i18next-language', 
      
      // Cache the selected language in localStorage
      caches: ['localStorage'], 
    },
    
    // Configuration for where to load the JSON files
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', 
    },

    interpolation: {
      escapeValue: false,
    },
    
    ns: ['translation'],
    defaultNS: 'translation',
  });

export default i18n;