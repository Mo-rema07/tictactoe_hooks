import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
    return (
        <button className="square" onClick={props.onClick}>
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
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
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
                    squares={current.squares}
                    onClick={(i) => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
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
            return squares[a];
        }
    }
    return null;
}

// TODO: Rewrite Board to use two loops to make the squares instead of hardcoding them.
// TODO: Add a toggle button that lets you sort the moves in either ascending or descending order.
// TODO: When someone wins, highlight the three squares that caused the win.
// TODO: When no one wins, display a message about the result being a draw.