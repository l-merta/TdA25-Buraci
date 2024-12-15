import React, { useState } from 'react';

interface GameBoardProps {
    size: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ size }) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    //@ts-ignore
    const [players, setPlayers] = useState<Array<string>>(["X", "O"]); // List of players - their symbols
    const [fields, setFields] = useState<string[][]>(Array.from({ length: size }, () => Array(size).fill(''))); // 2D array for game fields initialized with ''
    const [playing, setPlaying] = useState<number>(players.length - 1); // Current player index, defaults to last player to start with first on the next turn

    function onFieldClick(row: number, col: number) { // Function triggered when a field is clicked
        if (fields[row][col] === '') { // Check if the clicked field is empty
            createGame({name: "test-name", difficulty: "hard", board: fields});
            // Check if the last player in the list played
            if (playing === players.length - 1) {
                PlayField(row, col, 0); // Make the first player play
                setPlaying(0); // Set the first player as the current one
            } else {
                setPlaying((prevPlaying: any) => {
                    PlayField(row, col, prevPlaying + 1); // Make the current player play
                    return prevPlaying + 1; // Pass the turn to the next player in the list
                });
            }
        }
    }

    function PlayField(row: number, col: number, player: number) { // Function to update game fields, row and col = field position, player = player index in the players list
        setFields((prevFields) => {
            const newFields = prevFields.map((r) => [...r]); // Create a shallow copy of the 2D array
            newFields[row][col] = players[player]; // Update the specific field with the player's symbol
            return newFields;
        });
    }

    const createGame = async (gameData: object) => {
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
            return data; // Use this for further processing
        } catch (error: any) {
            console.error("Error creating game:", error.message);
        }
    };

    return (
        <div className="game-board" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
            {fields.map((row, rowIndex) => 
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
    );
};

export default GameBoard;
