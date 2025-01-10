//import React from 'react'
import { useTheme } from './ThemeHandler';
import { bouncy } from 'ldrs';
import 'ldrs/bouncy';

interface LoadingProps {
  color?: string;
  size?: string;
}

const Loading:React.FC<LoadingProps> = ({ color, size }) => {
  const theme = useTheme();
  bouncy.register();

  if (!size) size = "45";

  return (
    <div className="loading">
      <l-bouncy
        size={size}
        speed="1.75" 
        color={color ? color : theme == "theme-dark" ? "white" : "black"}
      ></l-bouncy>
    </div>
  )
}

export default Loading