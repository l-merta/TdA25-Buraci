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
      <Header active='team'/>
      <div className="bg-grad"></div>
      <div className="main-tda anim anim-slide-from-down">
        <h1>Tým Buráci</h1>
        <section className='sec-team'>
          <h2>Seznamte se s Buráky</h2>
          <h3>Jak se vyvíjely piškvorky</h3>
          <div className='text-team'>
            <p>
              Naše aplikace pro piškvorky umožňuje hrát hru několika způsoby. V lokálním režimu si můžete zahrát proti kamarádovi na jednom počítači - stačí si sednout k monitoru a užít si klasickou hru. Pokud chcete hrát na dálku, nabízíme multiplayer režim, který využívá <b>Socket.io</b> pro online komunikaci mezi hráči. To znamená, že můžete hrát proti přátelům, ať už jsou kdekoli na světě. Pokud nemáte proti komu hrát, můžete využít <b>naši umělou inteligenci Tádu</b>, který je navržen tak, aby skvěle bránil i útočil, což znamená, že vždy budete mít silného a zábavného soupeře.
            </p>
            <p>
              Kromě toho umožňuje aplikace sledování zápasů dvou AI botů, kde si můžete prohlédnout jejich strategii a získat inspiraci pro vlastní hru. Tento režim také funguje jako ideální nástroj pro trénink, pokud si chcete zlepšit své schopnosti.
            </p>
            <p>
              Aplikace běží na moderních technologiích, které zajišťují její plynulý chod. Frontend je postaven na <b>React a Vite</b>, což umožňuje rychlou a interaktivní uživatelskou zkušenost. Backend je postaven na <b>Node.js s Expressem</b>, což poskytuje robustní a škálovatelnou infrastrukturu pro multiplayer a správu herních dat. Pro uchovávání dat využíváme <b>MySQL databázi</b>, která nám umožňuje efektivně spravovat všechna herní data.
            </p>
            <p>
              Celý projekt je zabalen v <b>Dockeru</b>, což nám umožňuje snadné nasazení a správu aplikace. Stylování je řešeno pomocí <b>SCSS</b> pro flexibilní design, a pro ikony používáme <b>FontAwesome</b>. Design aplikace je navržen ve <b>Figmě</b>, což nám umožnilo vytvořit moderní a uživatelsky přívětivé prostředí.
            </p>
          </div>
        </section>
        <section className="sec-tech">
          <h3>Náš tech-stack</h3>
          <div className="tech">
            <img src="/images/tech/react.png" alt="" />
            <img src="/images/tech/express.png" alt="" />
            <img src="/images/tech/mysql.png" alt="" />
            <img src="/images/tech/socket.png" alt="" />
            <img src="/images/tech/docker.png" alt="" />
            <img src="/images/tech/github.png" alt="" />
            <img src="/images/tech/figma.png" alt="" />
          </div>
        </section>
        <section className='sec-team-cards'>
          <h2>Tým vývojářů</h2>
          <h3>Kdo za aplikací stojí</h3>
          <div className='group'>
            <a href="https://github.com/NorakSok" target='_blank'>
              <div className="card">
                <div className="wrapper">
                  <img src="images/team-picks/eric-clasic.jpg" className="cover-image" />
                </div>
                <span className="title">Norak Eric Sok</span>
                <img src="images/team-picks/eric-3D.png" className="character" />
              </div>
            </a>
            <a href="https://github.com/l-merta" target='_blank'>
              <div className="card">
                <div className="wrapper">
                  <img src="images/team-picks/sketa-clasic.webp" className="cover-image" />
                </div>
                <span className="title">Lukáš Merta</span>
                <img src="images/team-picks/lukes-3D.png" className="character" />
              </div>
            </a>
            <a href="https://github.com/degescigoma" target='_blank'>
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