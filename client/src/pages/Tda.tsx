//import { useState, useEffect } from 'react'
//import { Link } from "react-router-dom";
//import { useTheme, themeToImg } from './../components/ThemeHandler';

import Header from './../components/Header';
import Footer from './../components/Footer';

function Tda() {
  //const theme = useTheme();

  return (
    <>
      <Header />
      <div className="bg-grad"></div>
      <div className="main-tda">
        <h1>Stránka o TdA</h1>
      </div>
      <Footer />
    </>
  )
}

export default Tda