import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
    return (
        <button className={"square " +props.highlight} onClick={props.onClick}>
            {props.value}
        </button>
    );
};

const GridSquare = props => {
    return (
        <button className="gridSquare">
            {props.value}
        </button>
    )
};

const Board = (props) => {
    const renderSquare = (props,i) => {
        return (
            <Square
                highlight = {(props.winning.includes(i))? 'winning-square' : ''}
                value={props.squares[i]}
                onClick={() => props.onClick(i)}
            />
        )
    };
    return (
        <div>
            <div className="board-row">
                <GridSquare value = {0}/>
                {renderSquare(props,0)}
                {renderSquare(props,1)}
                {renderSquare(props,2)}
            </div>
            <div className="board-row">
                <GridSquare value = {1}/>
                {renderSquare(props,3)}
                {renderSquare(props,4)}
                {renderSquare(props,5)}
            </div>
            <div className="board-row">
                <GridSquare value = {2}/>
                {renderSquare(props,6)}
                {renderSquare(props,7)}
                {renderSquare(props,8)}
            </div>
            <GridSquare/>
            <GridSquare value = {0}/>
            <GridSquare value = {1}/>
            <GridSquare value = {2}/>
        </div>
    );

};

const Game = (props) => {
    const [history, setHistory] = useState(
        [{
            squares: Array(9).fill(null),
            location: ""
        }]
    );
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [listIsAscending, setListIsAscending] = useState(true);

    const handleClick =(i) => {
        const hist = history.slice(0, stepNumber + 1);
        const current = hist[hist.length - 1];
        const squares = current.squares.slice();
        const location = [Math.round((i-1)/3),i%3];

        if (calculateWinner(squares) || squares[i]) {
            alert('Invalid move!');
            return;
        }
        squares[i] = xIsNext ? 'X' : 'O';

        setHistory(
            hist.concat([{
                squares: squares,
                location: location
            }])
        );
        setStepNumber(hist.length);
        setXIsNext(!xIsNext);
    };
    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step%2 === 0));
    };

    const current = history[stepNumber];
    const [winner,winningSquares] = (calculateWinner(current.squares)===null) ?[null,[]]:calculateWinner(current.squares);
    console.log(winner);
    const moveList = listIsAscending ? history.slice() : history.slice().reverse();
    const moves = moveList.map((step, move) => {
        move = listIsAscending ? move : (moveList.length - move)-1;
        const desc = move ?
            'Go to move #' + move :
            'Go to game start';

        const isCurrentMove = (move === stepNumber) ? 'currentMove' : '';
        return(
            <li className= { isCurrentMove } key = {move}>
                <button className= { isCurrentMove } onClick={() => jumpTo(move)}>{desc+"\n("+step.location+")"}</button>
            </li>
        )
    });

    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
    return (
        <div className="game">
            <div className="game-board">
                <Board
                    winning={winningSquares}
                    squares={current.squares}
                    onClick={(i) => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <p>List Order : {listIsAscending? 'Ascending' : 'Descending'} </p>
                <label className="switch">
                    <input type="checkbox" onChange={() => setListIsAscending(!listIsAscending)}/>
                    <span className="slider round"/>
                </label>
                <br/>
                <div>{status}</div>
                <ol reversed={!listIsAscending} >{moves}</ol>
            </div>
        </div>
    );
};

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            // console.log([a,b,c]);
            return [squares[a],[a,b,c]];
            // return squares[a];
        }
    }
    return null;
}

// TODO: Rewrite Board to use two loops to make the squares instead of hardcoding them.
// TODO: When no one wins, display a message about the result being a draw.