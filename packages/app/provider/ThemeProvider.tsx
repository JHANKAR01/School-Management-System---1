
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { generatePalette } from '../utils/theme-generator';
import { Platform } from 'react-native';

interface ThemeContextType {
  primaryColor: string;
  palette: Record<number, string>;
}

const ThemeContext = createContext<ThemeContextType>({
  primaryColor: '#000000',
  palette: {},
});

export const ThemeProvider: React.FC<{ 
  primaryColor: string; 
  children: React.ReactNode 
}> = ({ primaryColor, children }) => {
  
  const palette = useMemo(() => generatePalette(primaryColor), [primaryColor]);

  // Apply CSS Variables for Web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const root = document.documentElement;
      Object.entries(palette).forEach(([shade, hex]) => {
        root.style.setProperty(`--color-primary-${shade}`, hex);
      });
      root.style.setProperty('--primary-color', primaryColor);
    }
  }, [primaryColor, palette]);

  return (
    <ThemeContext.Provider value={{ primaryColor, palette }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
