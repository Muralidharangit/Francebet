import React from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from 'react-bootstrap/Dropdown';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Function to change the language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;

  // Language map for display
  const languages = {
    'en': 'English',
    'bn': 'বাংলা (Bangla)'
  };

  return (
   <Dropdown>
      <Dropdown.Toggle 
        // Use 'outline-light' for a visible button with a white focus/look
        variant="outline-light" 
        id="dropdown-language-globe"
        className="d-flex align-items-center" // For aligning the icon and text
      >
        {/* Globe Icon */}
        <i 
            className="fas fa-globe" // Replace 'fas fa-globe' with your actual globe icon class (e.g., Bootstrap Icons: bi-globe)
            style={{ marginRight: '8px', color: '#FFF' }} // White icon color
        ></i>
        {/* Display the currently selected language name */}
        <span style={{ color: '#FFF' }}>
            {languages[currentLanguage] || languages['en']}
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu 
        // Optional: Add a custom dark background to the menu for contrast
        data-bs-theme="dark" 
      >
        {/* English Option */}
        <Dropdown.Item 
          onClick={() => changeLanguage('en')} 
          active={currentLanguage === 'en'}
          style={{ fontSize: '16px' }} // Consistent font size
        >
          English (en)
        </Dropdown.Item>

        {/* Bengali/Bangla Option */}
        <Dropdown.Item 
          onClick={() => changeLanguage('bn')} 
          active={currentLanguage === 'bn'}
          style={{ fontSize: '16px' }} // Consistent font size
        >
          বাংলা (bn)
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default LanguageSwitcher;