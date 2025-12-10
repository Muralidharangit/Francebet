// languageUtils.js

/**
 * Converts a two-letter country code to a Unicode flag emoji.
 * Note: This relies on Unicode support.
 * @param {string} countryCode - The two-letter country code (e.g., 'gb', 'bd').
 * @returns {string} The corresponding flag emoji.
 */
export const getFlagEmoji = (countryCode) => {
  if (!countryCode) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

// You can expand this if you need more complex mapping or language codes
export const getLanguageNativeName = (languageCode) => {
    const names = {
        'en': 'English',
        'bn': 'বাংলা',
        'gb': 'English', // Fallback for flag codes
        'bd': 'বাংলা', 
    };
    return names[languageCode.toLowerCase()] || languageCode;
};