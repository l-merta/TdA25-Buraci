import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from './../components/ThemeHandler';
import { usePopup } from './../components/PopupContext';

import Loading from './Loading';

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
    ai: Array<Number>;
    playerCurr: Array<Number>;
    socket?: any;
    isHost?: boolean;
    uuid?: string;
    replayButton?: boolean;
    playerNames?: Array<String>;
    editMode?: boolean;
    onlyBoard?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ size, ai, playerCurr, socket, isHost, uuid, replayButton, playerNames, editMode, onlyBoard }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const multiplayerType = location.pathname.includes("freeplay") ? "freeplay" : "online";
    const theme = useTheme();
    const params = useParams<{ uuid: string }>();
    const { showPopup } = usePopup();

    // Set the uuid from params if it's not provided as a prop
    if (!uuid) {
        uuid = params.uuid;
    }

    //@ts-ignore
    const [players, setPlayers] = useState<Array<string>>(["X", "O"]); // List of players - their symbols
    //@ts-ignore
    const [colors, setColors] = useState<Array<string>>(["cervene", "modre"]); // List of players - their symbols
    const [gameData, setGameData] = useState<GameBoardProps | any>({
        name: "",
        difficulty: "medium",
        board: Array.from({ length: size }, () => Array(size).fill('')),
        playing: players.length - 1,
        nextPlaying: 0,
        gameState: "unknown"
    });
    //const [difficulty, setDifficulty] = useState('medium');
    //@ts-ignore
    const [online, setOnline] = useState(false);
    const [firstMoveAfterLoad, setFirstMoveAfterLoad] = useState(false);
    const [isLoading, setIsLoading] = useState(uuid ? true : false);
    const initialMoveMade = useRef(false);
    const aiMoveInProgress = useRef(false);
    const [gameDataLoaded, setGameDataLoaded] = useState(false);
    const timeoutIds = useRef<number[]>([]);

    const clearTimeouts = () => {
        timeoutIds.current.forEach(timeoutId => clearTimeout(timeoutId));
        timeoutIds.current = [];
    };

    /*
    useEffect(() => {
        if (!popupShown) {
        showPopup("Prdíky a bobky");
        setPopupShown(true);
        }
    }, [popupShown, showPopup]);
    */

    useEffect(() => {
        if (playerCurr[0] === 1 || playerCurr[1] === 1) {
            //console.log("is online game");
            setOnline(true);
        }
    }, [playerCurr]);

    const fetchGameData = async () => {
        if (uuid) {
            try {
                setIsLoading(true);
                const response = await fetch(apiUrl + "games/" + uuid); // Replace with your API URL
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json(); // Parse JSON data
                setIsLoading(false);
                setFirstMoveAfterLoad(true);
                setGameData(result);
                setGameDataLoaded(true);
            } catch (error: any) {
                console.log(error.message); // Set error message if there's an issue
            }
        }
        else {
            setGameDataLoaded(true);
        }
    };

    // Get game with uuid from API
    useEffect(() => {
        fetchGameData();
    }, []);

    const onFieldClick = async (row: number, col: number) => {
        if ((gameData.board[row][col] && ai[getBeforePlaying()] !== 1) || gameData.win) return; // If the field is already played or the game is won, return
        if (aiMoveInProgress.current) return;

        aiMoveInProgress.current = true;

        if (!online) {
          try {
            const response = await fetch(`${apiUrl}gameFieldClick`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...gameData, row: row, col: col, ai: ai }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to play field in game");
            }

            const data = await response.json();
            setFirstMoveAfterLoad(false);
            setGameData(data);
          } catch (error: any) {
              console.error("Error playing field:", error.message);
          } finally {
              aiMoveInProgress.current = false;
          }
        }
        else {
          socket.emit("playField", { ...gameData, row: row, col: col, ai: ai });
        }
    };
    useEffect(() => {
        if (socket) {
            socket.on("playFieldProcessed", (newGameData: any) => {
                setGameData(newGameData);
                setFirstMoveAfterLoad(false);
                aiMoveInProgress.current = false;
            });
            socket.on("resetGameProcessed", () => {
                resetGame();
            });
        }
    }, [socket]);

    useEffect(() => {
        const isBoardFull = (board: any[][]) => {
            return board.every(row => row.every(cell => cell !== ''));
            //console.log("board full: ", board.every(row => row.every(cell => cell !== '')));
            //return false;
        };

        if (gameData.win) {
            const winningPlayerIndex = players.indexOf(gameData.win.player);
            const winningPlayerName = playerNames ? playerNames[winningPlayerIndex] : gameData.win.player;

            if (ai[0] == 1 && ai[1] == 1 && !replayButton) {
                const timeoutId = setTimeout(() => {
                    resetGame();
                }, 2000);
                timeoutIds.current.push(timeoutId);
            }
            else {
                // No AI-only match
                if (multiplayerType === "online") {
                    if (playerCurr[winningPlayerIndex] === 1) {
                        showPopup(`Vyhrál jsi!`);
                    } else {
                        showPopup(`Prohrál jsi..`);
                    }
                }
                else {
                    showPopup(`Vyhrál ${winningPlayerName}!`);
                }
            }
        } else {
            if (gameDataLoaded && ai[gameData.nextPlaying] == 1) {
                if (isBoardFull(gameData.board)) {
                    if (!replayButton) {
                      const timeoutId = setTimeout(() => {
                          resetGame();
                      }, 2000);
                      timeoutIds.current.push(timeoutId);
                    }
                } 
                else {
                    const timeoutId = setTimeout(() => {
                        onFieldClick(0, 0); // Play the AI move
                    }, 500);
                    timeoutIds.current.push(timeoutId);
                }
            }
        }
    }, [gameData, gameDataLoaded]);

    // Initial move for the first AI player
    useEffect(() => {
        if (uuid) {
            // Load game data using uuid
            const loadGameData = async () => {
                try {
                    const response = await fetch(`${apiUrl}games/${uuid}`);
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Failed to load game data");
                    }
                    const data = await response.json();
                    setGameData(data);
                    setGameDataLoaded(true);
                } catch (error: any) {
                    console.error("Error loading game data:", error.message);
                }
            };
            loadGameData();
        } else {
            setGameDataLoaded(true);
        }
    }, [uuid]);

    useEffect(() => {
        if ((gameDataLoaded && !initialMoveMade.current && ai[getBeforePlaying()] === 1 && !gameData.win) || gameDataLoaded && !initialMoveMade.current && ai[0] === 1 && gameData.playing == 0 && !gameData.win) {
            initialMoveMade.current = true;
            const timeoutId = setTimeout(() => {
                onFieldClick(0, 0); // Play the AI move
            }, 500);
            timeoutIds.current.push(timeoutId);
        }
    }, [gameDataLoaded, gameData]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameData((prevGameData: GameBoardProps) => {
            return { ...prevGameData, name: event.target.value};
        }); // Update game name state on input change
    };
    const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setGameData({ ...gameData, difficulty: event.target.value });
    };
    function onSaveClick() {
        createGame(gameData);
    }

    const createGame = async (gameData: GameDataProps) => {
        if (gameData.name.length > 0 && !gameData.board.every((row: any) => row.every((cell: any) => cell == ''))) {
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

    function onResetGameClick() {
        if (!online)
          resetGame();
        else
          socket.emit("resetGame");
    }
    function resetGame() {
        clearTimeouts();
        setGameDataLoaded(false);
        initialMoveMade.current = false;
        setGameData((prevData: any) =>{
            return {
                ...prevData,
                board: Array.from({ length: size }, () => Array(size).fill('')),
                playing: players.length - 1,
                nextPlaying: 0,
                win: null
            }
        });
        fetchGameData(); // Fetch the game data again after resetting
    }

    function getCharImage(char: String, useGrayScale: boolean) {
        const playerIndex = players.indexOf(char.toUpperCase());
        if (!useGrayScale)
            return "/images/icons/" + char.toUpperCase() + "_" + colors[playerIndex] + ".png";
        else 
            if (theme == "theme-light")
                return "/images/icons/" + char.toUpperCase() + "_bile.png";
            else 
                return "/images/icons/" + char.toUpperCase() + "_cerne.png";    
    }

    function isWinChar(row: number, col: number) {
        return {
            isWin: gameData.win && gameData.win.coordinates.some((coord: any) => coord.row === row && coord.col === col),
            color: gameData.win && colors[players.indexOf(gameData.win.player.toUpperCase())]
        }
    }

    function getBeforePlaying() {
        let index = gameData.playing - 1;
        index < 0 ? index = players.length - 1 : index;
        if (firstMoveAfterLoad)
            return gameData.playing;
        return index;
    }

    if (isLoading) {
      return <Loading />;
    }
    else {
      return (
        <div className="game-board-container anim anim-scale-up">
            {!editMode ? 
                (gameData.name && !onlyBoard && <h1>{gameData.name}</h1>)
            :
                <div className="edit">
                    <input type="text" placeholder="Název hry" defaultValue={gameData.name} onChange={handleNameChange} />
                    <select value={gameData.difficulty} onChange={handleDifficultyChange}>
                        <option value="beginner">Beginner</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="extreme">Extreme</option>
                    </select>
                    {editMode && <button onClick={onSaveClick} className="button button-blue">Uložit a zapnout hru</button>}
                </div>
            }
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
                  {replayButton && ((online && isHost) || !online) ?
                    <button className='replay' onClick={onResetGameClick}>
                        <i className="fa-solid fa-repeat"></i>
                        <span>Hrát znovu</span>
                    </button>
                  : ""}
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
                                (gameData.win && isWinChar(rowIndex, colIndex).isWin ? "field-win-" + isWinChar(rowIndex, colIndex).color + " " : " ") +
                                (ai[getBeforePlaying()] == 1 ? "field-ai " : " ") +
                                (online && playerCurr[gameData.playing] == 1 ? "field-opp " : " ")} 
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
    }
};

export default GameBoard;