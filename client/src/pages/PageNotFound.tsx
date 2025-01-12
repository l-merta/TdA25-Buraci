//import { useState, useEffect } from 'react'
//import { Link } from "react-router-dom";
//import { useTheme, themeToImg } from './../components/ThemeHandler';

import Header from './../components/Header';
import Footer from './../components/Footer';

function ErrorPage() {
  //const theme = useTheme();

  return (
    <>
      <Header />
      <div className="bg-grad"></div>
      <div className="main-error">
        <h1>Error page</h1>
      </div>
      <Footer />
    </>
  )
}

export default ErrorPage