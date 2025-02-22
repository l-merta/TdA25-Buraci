import React, { useState, useRef, useEffect } from 'react';
import { useUser } from './../components/User';

interface PlayerProps {
  player: any;
  index: number;
  socket: any;
}

function getCharImage(char: any, index: number) {
  const colors = ["cervene", "modre"];
  const imageUrl = "/images/icons/" + char.toUpperCase() + "_" + colors[index] + ".png";
  return imageUrl;
}

const PlayerItem: React.FC<PlayerProps> = ({ player, index, socket }) => {
  const { user, userLoading } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);

  const [nameEditing, setNameEditing] = useState(false);
  const [nameEmitted, setNameEmitted] = useState(false);

  useEffect(() => {
    if (nameEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [nameEditing]);

  useEffect(() => {
    if (!userLoading && user && player.playerCurr && !nameEmitted) {
      console.log("Emitting logged in name");
      socket.emit("userRename", { newName: user.username });
      setNameEmitted(true);
    }
  }, [userLoading, user, player, nameEmitted, socket]);

  const emitNewName = () => {
    if (inputRef.current) {
      const newName = inputRef.current.value;
      socket.emit("userRename", { newName: newName });
      console.log("New name:", newName);
      setNameEditing(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      emitNewName();
    }
  };

  return (
    <div className={"anim anim-scale-up player " + (player.playerCurr ? "player-curr" : "")}>
      <div className="char">
        <img src={getCharImage(player.playerChar, index)} alt="" />
      </div>
      <div className="name">
        {!nameEditing || !player.playerCurr ? 
          <>
            {player.playerName}
            {player.playerCurr && !user && 
              <button onClick={() => setNameEditing(true)}><i className="fa-solid fa-pen-to-square"></i></button>
            }
          </> :
          <>
            <input 
              type="text" 
              defaultValue={player.playerName} 
              ref={inputRef} 
              onKeyDown={handleKeyDown} 
            />
            <button onClick={emitNewName}><i className="fa-solid fa-check"></i></button>
            <button onClick={() => setNameEditing(false)}><i className="fa-solid fa-xmark"></i></button>
          </>
        }
      </div>
    </div>
  );
}

export default PlayerItem;