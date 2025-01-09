//import React from 'react'
import { useTheme, themeToImg } from './ThemeHandler'

const Footer = () => {
  const theme = useTheme();

  return (
    <footer>
      <div className="names">
        <img src={"/images/logos/Think-different-Academy_LOGO_textove-" + themeToImg(theme, "2.png", true)} alt="" />
        <span className="team">Vytvořil tým Buráci</span>
      </div>
      <div className="social">
        <a href="https://github.com/l-merta/TdA25-Buraci" target="_blank">
          <i className="fa-brands fa-github"></i>
        </a>
      </div>
    </footer>
  )
}

export default Footer
