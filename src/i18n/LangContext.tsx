import React, { createContext, useContext, useState } from 'react';
import { Lang, translations } from './translations';

interface LangContextValue {
  lang: Lang;
  t: typeof translations['en'];
  toggleLang: () => void;
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  t: translations['en'],
  toggleLang: () => {},
});

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('en');

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'es' : 'en'));

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggleLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
