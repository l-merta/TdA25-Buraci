import { useLocation } from "react-router-dom";

import Header from "./../components/Header";
import Footer from "./../components/Footer";

interface GameSettProps {
  gameMode: string;
  playerNames: Array<String>;
  ai: Array<Number>;
}

function OnlineRoom() {
  const location = useLocation();
  const gameSett: GameSettProps = location.state || {
    // Default values
    gameMode: "online",
    playerNames: ["Hráč 1", "Hráč 2"],
    ai: [0, 0]
  };

  console.log(gameSett);

  return (
    <>
      <Header />
      <div className="bg-grad"></div>
      <div className="main-tda">
        <h1>Online Room</h1>
      </div>
      <Footer />
    </>
  )
}

export default OnlineRoom