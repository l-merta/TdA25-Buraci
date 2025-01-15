import { Link } from "react-router-dom";

import GameBoard from "./../components/GameBoard";

const Create = () => {
  document.title = "Vytvořit - TdA";

  return (
    <>
      <Link to="/games">Games</Link>
      <h1>Create page</h1>
      <GameBoard size={15} editMode={true} ai={[0, 0]} playerCurr={[0, 0]} />
    </>
  )
}

export default Create
