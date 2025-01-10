import GameList from './../components/GameList';
//import { Link } from "react-router-dom";

import Header from './../components/Header';
import Footer from './../components/Footer';

const Games = () => {
  return (
    <>
      <Header />
      <div className="bg-grad"></div>
      <div className="main-games">
        <h1>Uložené hry piškvorek</h1>
        <GameList />
      </div>
      <Footer />
    </>
  )
}

export default Games
