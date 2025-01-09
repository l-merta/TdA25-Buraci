import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface GameDataProps {
    uuid: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    difficulty: string;
    gameState: string;
    board: Array<String>;
}
interface GameBoardProps {
    size: number;
    playerNames?: Array<String>;
    editMode?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ size, playerNames, editMode }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();

    //@ts-ignore
    const [players, setPlayers] = useState<Array<string>>(["X", "O"]); // List of players - their symbols
    //@ts-ignore
    const [colors, setColors] = useState<Array<string>>(["cervene", "modre"]); // List of players - their symbols
    const [gameData, setGameData] = useState<GameBoardProps | any>({
        name: "",
        difficulty: "medium",
        board: Array.from({ length: size }, () => Array(size).fill('')),
        playing: players.length - 1,
        gameState: "unknown"
    });

    // Get game with uuid from API
    useEffect(() => {
        if (uuid) {
            const fetchData = async () => {
                try {
                    const response = await fetch(apiUrl + "games/" + uuid); // Replace with your API URL
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const result = await response.json(); // Parse JSON data
                    setGameData(result);
                    console.log(result);
                } catch (error: any) {
                    console.log(error.message); // Set error message if there's an issue
                }
            };
        
            fetchData(); // Call the fetch function
        }
    }, []); // Empty dependency array means this runs once on mount

    async function onFieldClick(row: number, col: number) { // Function triggered when a field is clicked
        if (gameData.board[row][col] === '') { // Check if the clicked field is empty
            try {
                const response = await fetch(`${apiUrl}gameFieldClick`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...gameData, row: row, col: col }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to play field in game");
                }

                const data = await response.json();
                setGameData(data);
                //console.log("Field played successfully:", data, data.uuid);
                if (data.win) {
                    console.log(data.win);
                    console.log("Player " + data.win.player + " won!");
                }
            } catch (error: any) {
                console.error("Error playing field:", error.message);
            }
        }
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameData((prevGameData: GameBoardProps) => {
            return { ...prevGameData, name: event.target.value};
        }); // Update game name state on input change
    };
    function onSaveClick() {
        createGame(gameData);
    }
    const createGame = async (gameData: GameDataProps) => {
        if (gameData.name.length > 0) {
            if (uuid) {
                // Update already existing game
                try {
                    const response = await fetch(`${apiUrl}games/${uuid}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(gameData),
                    });
    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Failed to update game");
                    }
    
                    const data = await response.json();
                    console.log("Game updated successfully:", data, data.uuid);
                    navigate("/game/" + data.uuid);
                } catch (error: any) {
                    console.error("Error updating game:", error.message);
                }
            }
            else {
                // Create new game
                try {
                    const response = await fetch(apiUrl + "games", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(gameData),
                    });
        
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Failed to create game");
                    }
        
                    const data = await response.json();
                    console.log("Game created successfully:", data);
                    navigate("/game/" + data.uuid);
                } catch (error: any) {
                    console.error("Error creating game:", error.message);
                }
            }
        }
    };
    function getCharImage(char: String, useGrayScale: boolean) {
        const playerIndex = players.indexOf(char.toUpperCase());
        if (!useGrayScale)
            return "/images/icons/" + char.toUpperCase() + "_" + colors[playerIndex] + ".png";
        else 
            return "/images/icons/" + char.toUpperCase() + "_bile.png";
    }
    function isWinChar(row: number, col: number) {
        return {
            isWin: gameData.win && gameData.win.coordinates.some((coord: any) => coord.row === row && coord.col === col),
            color: gameData.win && colors[players.indexOf(gameData.win.player.toUpperCase())]
        }
    }
    function getBeforePlaying() {
        let index = gameData.playing - 1;
        //console.log(index);
        index < 0 ? index = players.length - 1 : index;
        //console.log(index);
        return index;
    }

    return (
        <div className="game-board-container">
            {!editMode ? 
                (gameData.name && <h1>{gameData.name}</h1>)
            :
                <input type="text" placeholder="Název hry" defaultValue={gameData.name} onChange={handleNameChange} />
            }
            {editMode && <button onClick={onSaveClick} className="button-main">Uložit a zapnout hru</button>}
            <div className="wrapper">
              {playerNames ?
                <div className="players">
                  <div className={"player player-" + (!gameData.win && getBeforePlaying() == 0 ? "playing " : " ") + (gameData.win && gameData.win.player == players[0] ? "player-win " : "")}>
                    <img src={getCharImage(players[0], false)} alt="" />
                    <div className="name">{playerNames && playerNames[0]}</div>
                    {gameData.win && gameData.win.player == players[0] ? 
                        <i className="fa-solid fa-crown"></i>
                    : ""}
                  </div>
                  <div className={"player player-" + (!gameData.win && getBeforePlaying() == 1 ? "playing " : " ") + (gameData.win && gameData.win.player == players[1] ? "player-win " : "")}>
                    <div className="name">{playerNames && playerNames[1]}</div>
                    {gameData.win && gameData.win.player == players[1] ? 
                        <i className="fa-solid fa-crown"></i>
                    : ""}
                    <img src={getCharImage(players[1], false)} alt="" />
                  </div>
                </div> 
              : ""}
              <div className={"game-board " + (gameData.win ? "game-board-win " : "")} style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
                  {gameData.board.map((row: Array<String>, rowIndex: number) => 
                      row.map((item, colIndex) => (
                          <div 
                              className={"field " + 
                                ("field-" + colors[getBeforePlaying()] + " ") + 
                                (!item ? "field-empty " : "field-played ") + 
                                (gameData.win && isWinChar(rowIndex, colIndex).isWin ? "field-win-" + isWinChar(rowIndex, colIndex).color + " " : " ")} 
                              key={`${rowIndex}-${colIndex}`} 
                              onClick={() => { onFieldClick(rowIndex, colIndex); }}
                          >
                              {item && 
                                <img src={getCharImage(item, isWinChar(rowIndex, colIndex).isWin)} alt={item.toUpperCase()} /> 
                              || '.'}
                          </div>
                      ))
                  )}
              </div>
            </div>
        </div>
    );
};

export default GameBoard;