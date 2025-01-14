import React, { useState } from 'react'

interface PlayerProps {
  player: any;
  index: number;
}

const PlayerItem:React.FC<PlayerProps> = ({ player, index }) => {
  const [nameEditing, setNameEditing] = useState(false);

  function getCharImage(char: any, index: number) {
    const colors = ["cervene", "modre"];

    const imageUrl = "/images/icons/" + char.toUpperCase() + "_" + colors[index] + ".png";
    return imageUrl;
  }

  return (
    <div className={"player " + (player.playerCurr ? "player-curr" : "")}>
      <div className="char">
      <img src={getCharImage(player.playerChar, index)} alt="" />
      </div>
      <div className="name">
        {!nameEditing || !player.playerCurr ? 
          <>
          {player.playerName}
          {player.playerCurr && 
            <button onClick={() => setNameEditing(true)}><i className="fa-solid fa-pen-to-square"></i></button>
          }
          </> :
          <>
          <input type="text" defaultValue={player.playerName} />
          <button onClick={() => setNameEditing(false)}><i className="fa-solid fa-check"></i></button>
          <button onClick={() => setNameEditing(false)}><i className="fa-solid fa-xmark"></i></button>
          </>
        }
      </div>
    </div>
  )
}

export default PlayerItem