import React, { useState } from 'react'

interface GameBoardProps {
    size: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ size }) => {
    const [players, setPlayers] = useState<Array<string>>(["X", "O"]); // seznam hráčů - jejich znamínka
    const [fields, setFields] = useState<Array<string | number>>(Array(size * size).fill(null)); // seznam hracích polí - co maj v sobě
    const [playing, setPlaying] = useState<number>(players.length - 1); // kdo zrovna hraje, by default poslední player aby při prvním tahu skočil na prvního

    function onFieldClick(index: number) {
        if (fields[index] == null) { // koukne se jestli na kliknutým poli někdo už nehrál
            // koukne se jestli odehrál poslední hráč v seznamu
            if (playing == players.length - 1) {
                PlayField(index, 0); // odehraje za prvního hráče
                setPlaying(0); // nastaví prvního týpka jako toho co teď gamesí
            }
            else {
                setPlaying((prevPlaying: any) => {
                    PlayField(index, prevPlaying + 1); // odehraje za actualního hráče
                    return prevPlaying + 1; // předá hraní na dalšího v seznamu
                });
            }
        }
    }
    function PlayField(index: number, player: number) {
        setFields((prevFields: any) => {
            return prevFields.map((field: any, i: number) => (i === index ? player : field)) // dá na pole index číslo playera v seznamu players
        });
    }

    return (
        <div className="game-board"  style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
            {fields.map((item: any, index: number) => (
                <div className="field" key={index} onClick={()=>{onFieldClick(index)}}>{players[item] ? players[item] : "."}</div>
            ))}
        </div>
    )
}

export default GameBoard