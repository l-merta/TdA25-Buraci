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
        <h1>Tým Buráci</h1>
        <section className='sec-team'>
          <h2>Seznamte se s Buráky</h2>
          <h3>Jak se vyvíjeli piškvorky</h3>
          <div className='text-team'>
              <p>
                Naše aplikace pro piškvorky umožňuje hrát hru několika způsoby. V lokálním režimu si můžete zahrát proti kamarádovi na jednom počítači – stačí si sednout k monitoru a užít si klasickou hru. Pokud chcete hrát na dálku, nabízíme multiplayer režim, který využívá <span className='bold-text-team'>Socket.io</span> pro online komunikaci mezi hráči. To znamená, že můžete hrát proti přátelům, ať už jsou kdekoli na světě. Pokud nemáte proti komu hrát, můžete využít <span className='bold-text-team'>naši umělou inteligenci Tádou</span>, která je navržena tak, aby se učila a přizpůsobovala, což znamená, že vždy budete mít silného a zábavného soupeře.
              </p>
              <p>
                Kromě toho umožňuje aplikace sledování zápasů dvou AI botů, kde si můžete prohlédnout jejich strategii a získat inspiraci pro vlastní hru. Tento režim také funguje jako ideální nástroj pro trénink, pokud si chcete zlepšit své schopnosti.
              </p>
              <p>
                Aplikace běží na moderních technologiích, které zajišťují její plynulý chod. Frontend je postaven na <span className='bold-text-team'>React a Vite</span>, což umožňuje rychlou a interaktivní uživatelskou zkušenost. Backend je postaven na <span className='bold-text-team'>Node.js s Expressem</span>, což poskytuje robustní a škálovatelnou infrastrukturu pro multiplayer a správu herních dat. Pro uchovávání dat využíváme <span className='bold-text-team'>MySQL databázi</span>, která nám umožňuje efektivně spravovat uživatelské účty a historii her.
              </p>
              <p>
                Celý projekt je zabaleno v <span className='bold-text-team'>Dockeru</span>, což nám umožňuje snadnou nasazení a správu aplikace. Stylování je řešeno pomocí <span className='bold-text-team'>SCSS</span> pro flexibilní design, a pro ikony používáme <span className='bold-text-team'>FontAwesome</span>. Design aplikace je navržen v <span className='bold-text-team'>Figmě</span>, což nám umožnilo vytvořit moderní a uživatelsky přívětivé prostředí.
              </p>

          </div>
        </section>

        <section className='sec-team-cards'>
        <h1>Vývojáři</h1>
        <div className='group'>
        <a href="https://github.com/NorakSok">
        <div className="card">
            <div className="wrapper">
                <img src="images/team-picks/eric-clasic.jpg" className="cover-image" />
            </div>
            <span className="title">Eric Norak Sok</span>
            <img src="images/team-picks/eric-3D.png" className="character" />
        </div>
    </a>

    <a href="https://github.com/l-merta">
        <div className="card">
            <div className="wrapper">
                <img src="images/team-picks/sketa-clasic.webp" className="cover-image" />
            </div>
            <span className="title">Lukáš Merta</span>
            <img src="images/team-picks/lukes-3D.png" className="character" />
        </div>
    </a>

    <a href="https://github.com/degescigoma">
        <div className="card">
            <div className="wrapper">
                <img src="images/team-picks/bobek-clasik.jpg" className="cover-image" />
            </div>
            <span className="title">Robert Němeček</span>
            <img src="images/team-picks/bobek-3D.png" className="character" />
        </div>
    </a>
    </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Team