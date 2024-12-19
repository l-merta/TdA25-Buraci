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
    editMode?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ size, editMode }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();

    //@ts-ignore
    const [players, setPlayers] = useState<Array<string>>(["X", "O"]); // List of players - their symbols
    const [gameData, setGameData] = useState<GameBoardProps | any>({
        name: "",
        difficulty: "test diff",
        board: Array.from({ length: size }, () => Array(size).fill('')),
        playing: players.length - 1
    });
    //const [fields, setFields] = useState<string[][]>(Array.from({ length: size }, () => Array(size).fill(''))); // 2D array for game fields initialized with ''
    //const [playing, setPlaying] = useState<number>(players.length - 1); // Current player index, defaults to last player to start with first on the next turn

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
                    //console.log(result);
                } catch (error: any) {
                    console.log(error.message); // Set error message if there's an issue
                }
            };
        
            fetchData(); // Call the fetch function
        }
    }, []); // Empty dependency array means this runs once on mount

    async function onFieldClick(row: number, col: number) { // Function triggered when a field is clicked
        if (gameData.board[row][col] === '') { // Check if the clicked field is empty
            /*
            setGameData((prevData: any) => {
                PlayField(row, col, prevData.playing); // Make the current player play
                return { ...prevData, playing: prevData.playing } // Pass the turn to the next player in the list
            });
            */
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
            } catch (error: any) {
                console.error("Error playing field:", error.message);
            }
        }
    }

    /*
    function PlayField(row: number, col: number, player: number) { // Function to update game fields, row and col = field position, player = player index in the players list
        console.log(player, players[player]);
        setGameData((prevData: any) => {
            const newFields = prevData.board.map((r: any) => [...r]); // Create a shallow copy of the 2D array
            newFields[row][col] = players[player]; // Update the specific field with the player's symbol
            return { ...prevData, board: newFields };
        });
    }
    */

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

    return (
        <div className="game-board-container">
            {!editMode ? 
                <h1>{gameData.name}</h1>
            :
                <input type="text" placeholder="Název hry" defaultValue={gameData.name} onChange={handleNameChange} />
            }
            {editMode && <button onClick={onSaveClick} className="button-main">Uložit a zapnout hru</button>}
            <div className="game-board" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
                {gameData.board.map((row: Array<String>, rowIndex: number) => 
                    row.map((item, colIndex) => (
                        <div 
                            className={"field " + (!item ? "field-empty " : "field-played ")} 
                            key={`${rowIndex}-${colIndex}`} 
                            onClick={() => { onFieldClick(rowIndex, colIndex); }}
                        >
                            {item || '.'}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GameBoard;
