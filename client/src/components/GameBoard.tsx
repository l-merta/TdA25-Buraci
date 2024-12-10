import React, { useState } from 'react'

interface GameBoardProps {
    size: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ size }) => {
    const [fields, setFields] = useState(Array(size * size).fill(null));

    function onFieldClick(index: number) {
        setFields((prevFields) => 
            prevFields.map((field: any, i: number) => (i === index ? 'X' : field))
        );
    }

    return (
        <div className="game-board"  style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
            {fields.map((item: any, index: number) => (
                <div className="field" key={index} onClick={()=>{onFieldClick(index)}}>{item}</div>
            ))}
        </div>
    )
}

export default GameBoard