import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../../../types';

// Embedded Dictionaries to avoid network calls for translations
const DICTIONARIES: Record<LanguageCode, Record<string, string>> = {
  en: {
    "welcome": "Welcome",
    "dashboard": "Dashboard",
    "attendance": "Attendance",
    "fees": "Fees",
    "transport": "Transport",
    "library": "Library",
    "hostel": "Hostel",
    "pay_now": "Pay Now",
    "sync_status": "Sync Status",
    "present": "Present",
    "absent": "Absent",
    "low_data": "Low Data Mode",
    "mark": "Mark",
    "route": "Route",
    "logout": "Logout"
  },
  hi: {
    "welcome": "स्वागत हे",
    "dashboard": "डैशबोर्ड",
    "attendance": "उपस्थिति",
    "fees": "शुल्क",
    "transport": "परिवहन",
    "library": "पुस्तकालय",
    "hostel": "छात्रावास",
    "pay_now": "अभी भुगतान करें",
    "sync_status": "सिंक स्थिति",
    "present": "उपस्थित",
    "absent": "अनुपस्थित",
    "low_data": "लो डेटा मोड",
    "mark": "चिह्नित करें",
    "route": "रूट",
    "logout": "लॉग आउट"
  },
  mr: {
    "welcome": "स्वागत आहे",
    "dashboard": "डॅशबोर्ड",
    "attendance": "हजेरी",
    "fees": "फी",
    "transport": "वाहतूक",
    "library": "ग्रंथालय",
    "hostel": "वसतिगृह",
    "pay_now": "आत्ता भरा",
    "sync_status": "सिंक स्थिती",
    "present": "हजर",
    "absent": "गैरहजर",
    "low_data": "लो डेटा मोड",
    "mark": "नोंदवा",
    "route": "मार्ग",
    "logout": "बाहेर पडा"
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  // Load from local storage on mount (simulated)
  useEffect(() => {
    const saved = localStorage.getItem('sovereign_lang') as LanguageCode;
    if (saved && DICTIONARIES[saved]) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem('sovereign_lang', lang);
  };

  const t = (key: string) => {
    return DICTIONARIES[language][key] || DICTIONARIES['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
