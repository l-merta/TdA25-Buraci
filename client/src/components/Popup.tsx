import React from 'react';
import { usePopup } from './PopupContext';

interface PopupProps {
  text: string;
  type?: string;
}

const Popup: React.FC<PopupProps> = ({ text, type }) => {
  const { hidePopup } = usePopup();

  return (
    <div className={"popup popup-" + type}>
      <div className="popup-inner">
        <span className="text">{text}</span>
        <button className="button button-red button-border close" onClick={hidePopup}>Zavřít</button>
      </div>
    </div>
  );
};

export default Popup;
