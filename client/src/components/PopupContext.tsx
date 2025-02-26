import React, { createContext, useState, useContext, ReactNode } from 'react';

import Popup from './Popup';

interface PopupContextProps {
  showPopup: (text: string, type?: string) => void;
  hidePopup: () => void;
}

const PopupContext = createContext<PopupContextProps | undefined>(undefined);

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const PopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [popup, setPopup] = useState<{ text: string; type?: string } | null>(null);

  const showPopup = (text: string, type?: string) => {
    setPopup({ text, type });
  };

  const hidePopup = () => {
    setPopup(null);
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popup && <Popup text={popup.text} type={popup.type} />}
    </PopupContext.Provider>
  );
};