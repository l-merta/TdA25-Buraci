//import { useState, useEffect } from 'react'
//import { Link } from "react-router-dom";
import { useTheme, themeToImg } from './../components/ThemeHandler';

import Header from './../components/Header';
import Footer from './../components/Footer';

function Tou() {
  document.title = "Terms of Use - TdA";

  const theme = useTheme();

  return (
    <>
      <Header/>
      <div className="bg-grad"></div>
      <div className="main-tda anim anim-slide-from-down">
        <h1>Podmínky použití</h1>
        <section className='sec-tda'>
          <h2>Používáním souhlasíte s pravidly</h2>
          <h3 className=''>Respektujeme vaše práva a soukromí</h3>
          <div className='text-tda'>
            <p>
              Používáním naší webové aplikace na hraní piškvorek souhlasíte s tím, že nebudete zneužívat službu, porušovat práva ostatních uživatelů ani narušovat provoz aplikace. Registrací potvrzujete, že zadáváte pravdivé údaje. Vaše přihlašovací údaje a profilové informace jsou chráněny a nejsou sdíleny s třetími stranami. Vyhrazujeme si právo kdykoliv upravit podmínky používání. Pokud s nimi nesouhlasíte, můžete svůj účet kdykoliv smazat.
            </p>
          </div>
          <img src={"/images/logos/Buraci-logo-default.png"} alt=""/>
          </section>
      </div>
      <Footer />
    </>
  )
}

export default Tou