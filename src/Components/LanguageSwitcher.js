import React from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from 'react-bootstrap/Dropdown';
import { getFlagEmoji, getLanguageNativeName } from '../utils/languageUtils'; // Assuming this utility file exists

// Utility functions (You should define this file, see section 2 below)
// Example: getFlagEmoji('en') -> '🇺🇸'
// Example: getLanguageNativeName('bn') -> 'বাংলা'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  // Function to change the language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;

  // Define supported languages with their display properties
  const supportedLanguages = {
    'en': { name: 'English', flagCode: 'gb' }, // Using 'gb' for the UK flag (common for English)
    'bn': { name: 'বাংলা', flagCode: 'bd' }    // Using 'bd' for the Bangladesh flag
  };
  
  // Get the display info for the currently selected language, defaulting to English if the key is missing
  const currentLangInfo = supportedLanguages[currentLanguage] || supportedLanguages['en'];
  
  // Custom style for the flag display
  const flagStyle = {
    fontSize: '1.2rem',
    marginRight: '8px',
  };

  return (
   <Dropdown>
      {/* --- Dropdown Toggle Button (Responsive) --- */}
      <Dropdown.Toggle 
        variant="outline-light" 
        id="dropdown-language-flag"
        className="d-flex align-items-center justify-content-between p-1 text-white" 
        style={{ minWidth: '110px', backgroundColor: '#002643', borderColor: '#ccc' }}
      >
        {/* Flag and Name (Visible on Toggle) */}
        <div className="d-flex align-items-center">
            <span style={flagStyle}>
                {getFlagEmoji(currentLangInfo.flagCode)}
            </span>
            <span className="d-none d-sm-inline">{currentLangInfo.name}</span>
            <span className="d-sm-none">{currentLangInfo.flagCode.toUpperCase()}</span> {/* Abbreviated name for small screens */}
        </div>
      </Dropdown.Toggle>

      {/* --- Dropdown Menu --- */}
      <Dropdown.Menu data-bs-theme="dark">
        {Object.entries(supportedLanguages).map(([code, info]) => (
          <Dropdown.Item 
            key={code}
            onClick={() => changeLanguage(code)} 
            active={currentLanguage === code}
            className="d-flex align-items-center"
          >
            <span style={flagStyle}>{getFlagEmoji(info.flagCode)}</span>
            <span className="me-2">{info.name}</span>
            <small className="text-muted">({code})</small>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default LanguageSwitcher;