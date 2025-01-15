//import { useState, useEffect } from 'react'
//import { Link } from "react-router-dom";
import { useTheme, themeToImg } from './../components/ThemeHandler';

import Header from './../components/Header';
import Footer from './../components/Footer';

function Tda() {
  const theme = useTheme();

  return (
    <>
      <Header />
      <div className="bg-grad"></div>
      <div className="main-tda">
        <h1>Stránka o TdA</h1>
        <section className='sec-tda'>
          <h2>O nás</h2>
          <h3 className=''>Jsme Think different Academy</h3>
          <div className='text-tda'>
            <p>
              Think Different Academy je nezisková organizace zaměřená na podporu rozvoje myšlení u studentů i širší veřejnosti. Cílem organizace je přinášet inovativní způsoby, jak zlepšit logické a analytické schopnosti jednotlivců. V současnosti se Think Different Academy soustředí na vývoj unikátní piškvorkové platformy, která digitalizuje tradiční hru a poskytuje uživatelům atraktivní herní zážitek.
            </p>
            <p>
              Platforma nabídne možnost hraní klasických piškvorek v režimu lokálního multiplayeru, čímž umožní hráčům užít si hru s přáteli a rodinou. Kromě toho bude zahrnovat také speciální piškvorkové úlohy, které poslouží k trénování a zlepšování herních dovedností. Tento prostor pro cvičení bude skvělou volbou pro všechny, kteří chtějí zdokonalit svou strategii a naučit se nové taktiky.
            </p>
            <p>
              Do budoucna plánuje Think Different Academy rozšířit svou nabídku o další logické hry, čímž chce nabídnout rozmanité výzvy pro všechny zájemce o rozvoj svého myšlení a zábavu.
            </p>
          </div>
          <img src={"/images/logos/Think-different-Academy_LOGO_oficialni_" + themeToImg(theme, ".png")} alt=""/>
          </section>
      </div>
      <Footer />
    </>
  )
}

export default Tda