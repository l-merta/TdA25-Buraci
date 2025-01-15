//import { useState, useEffect } from 'react'
//import { Link } from "react-router-dom";
//import { useTheme, themeToImg } from './../components/ThemeHandler';

import Header from './../components/Header';
import Footer from './../components/Footer';

function Team() {
  document.title = "O týmu a aplikaci - TdA";
  //const theme = useTheme();

  return (
    <>
      <Header />
      <div className="bg-grad"></div>
      <div className="main-tda">
        <h1>Stránka o Burácích</h1>
      </div>
      <Footer />
    </>
  )
}

export default Team