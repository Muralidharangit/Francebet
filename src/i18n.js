import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // Load translations from the public folder
  .use(initReactI18next) // Integrate i18next with React
  .init({
    // Initial language setting (must match one of your folder names)
    lng: 'en', 
    
    // Fallback language if a key is missing in the current language
    fallbackLng: 'en', 
    
    // Enable debug logging in the console (useful for setup, can be set to false later)
    debug: true,

    // Configuration for where to load the JSON files
    backend: {
      // This path points to /public/locales/{{lng}}/translation.json
      // where {{lng}} will be replaced by 'en', 'bn', etc.
      loadPath: '/locales/{{lng}}/translation.json', 
    },

    // Not strictly needed in React, but good practice
    interpolation: {
      escapeValue: false,
    },
    
    // Define the namespace (name of the JSON file, usually 'translation')
    ns: ['translation'],
    defaultNS: 'translation',
  });

export default i18n;