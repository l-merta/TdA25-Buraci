//import { useState, useEffect } from 'react'
//import { Link } from "react-router-dom";
import { useTheme, themeToImg } from './../components/ThemeHandler';

import Header from './../components/Header';
import Footer from './../components/Footer';

function Gdpr() {
  document.title = "GDPR - TdA";

  const theme = useTheme();

  return (
    <>
      <Header/>
      <div className="bg-grad"></div>
      <div className="main-tda anim anim-slide-from-down">
        <h1>GDPR</h1>
        <section className='sec-tda'>
          <h2>Sběr dat</h2>
          <h3 className=''>Vaše data zůstávají v bezpečí</h3>
          <div className='text-tda'>
            <p>
              Vaše soukromí je pro nás důležité. Při registraci do naší aplikace na hraní piškvorek používáme pouze e-mail, heslo a volitelně profilovou fotku. Tyto údaje jsou bezpečně uloženy a nejsou sdíleny s žádnými třetími stranami. Hesla jsou chráněna šifrováním a profilové fotky slouží pouze pro zobrazení ve hře. K vašim datům nemá přístup nikdo jiný než vy. Pokud si přejete svůj účet smazat, můžete nás kontaktovat a všechna vaše data budou odstraněna. Dbáme na bezpečnost a ochranu vašich osobních údajů v souladu s GDPR.
            </p>
          </div>
          <img src={"/images/logos/Buraci-logo-default.png"} alt=""/>
          </section>
      </div>
      <Footer />
    </>
  )
}

export default Gdpr