//import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { useTheme, themeToImg } from './../components/ThemeHandler';

import Effect from './../components/Effect';
import GameBoard from "./../components/GameBoard";
import Header from './../components/Header';
import Footer from './../components/Footer';

function App() {
  document.title = "Domů - TdA";

  const theme = useTheme();
  const aiGameSett = {
    id: 1,
    gameMode: "ai",
    playerNames: ["Hráč 1", "Táda"],
    ai: [0, 1]
  }

  return (
    <>
      <Header />
      <div className="bg-grad"></div>
      <main>
        <Effect />
        <img src={theme && theme == "theme-light" ? 
          "/images/logos/Think-different-Academy_LOGO_cerny.png" :
          "/images/logos/Think-different-Academy_LOGO_bily.png"} 
          alt="TdA logo" 
          className="anim anim-slide-from-down"
        />
        <h1>
          <span className='main'>Think different</span>
          <span className='sec'>Academy</span>
        </h1>
        <p className="anim anim-slide-from-down">
          Nezisková organizace zaměřená na <b className='b-blue'>rozvoj</b> myšlení <b className='b-blue'>studentů i široké veřejnosti</b>.
          Vyvíjíme <b className='b-blue'>piškvorkovou platformu</b>, která má digitalizovat piškvorky
          a poskytnout uživatelům <b className='b-blue'>atraktivní herní zážitek</b>.
        </p>
        <nav>
          <Link to="/game" className='button button-1 button-red anim anim-slide-from-down'>Nová hra</Link>
          <Link to="/games" className='button button-1 button-red button-border anim anim-slide-from-down'>Seznam her</Link>
          {/* <Link to="/create" className='button button-blue'>Vytvořit hru</Link> */}
        </nav>
      </main>
      <section className='sec-ai anim anim-slide-from-down'>
        <div className="s1">
          <h2>Zkus porazit Tádu!</h2>
          <h3>Dokážeš vyhrát piškvorky <br /> proti našemu chytrému AI?</h3>
          <div className="text">
            <p>Táda je naše šikovné AI, které miluje piškvorky a neudělá ti to jednoduché. Přijmi výzvu, procvič svou strategii a zjisti, jestli dokážeš najít cestu k vítězství! Budeš lepší než Táda, nebo se necháš přechytračit?</p>
            <img src={"/images/icons/zarivka_playing_" + themeToImg(theme, ".png")} alt="Táda" />
          </div>
          <div className="actions">
            <Link to="/game" state={aiGameSett} className='button button-red'>Vyzkoušej své schopnosti!</Link>
          </div>
        </div>
        <div className="s2">
          <div className="board">
            <GameBoard size={10} playerNames={["Táda", "Táda"]} ai={[1, 1]} playerCurr={[0, 0]} />
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default App