import { useParams } from "react-router-dom";

import GameBoard from "./../components/GameBoard";
import Header from "./../components/Header";
import Footer from "./../components/Footer";

const Create = () => {
  document.title = "Vytvořit - TdA";

  const { uuid } = useParams<{ uuid: string }>();
  console.log(uuid);

  return (
    <>
      <Header />
      <div className="bg-grad"></div>
      <div className="main-game anim anim-slide-from-down">
        <h1>{uuid ? "Upravení hry" : "Vytvoření hry"}</h1>
        <GameBoard size={15} editMode={true} ai={[0, 0]} playerCurr={[0, 0]} />
      </div>
      <Footer />
    </>
  )
}

export default Create
