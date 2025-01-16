import React, { useState, useEffect } from 'react';

function Cell({value, onCellClick}){
  return (
    <button className="square" onClick={onCellClick}>{value}</button>
  );
}

function Board({xIsNext, boardValues, onPlay, gameOver}) {
  const winner = calculateWinner(boardValues)
  const draw = boardFull(boardValues)
  const endGame = (winner || draw) ? true : false;
  let status; 
  if(winner){
    status = "Winner: " + winner
  } else if (draw){
    status = "Game Over: Draw!"
  }else {
    status = "Next Player: "+(xIsNext? "X" : "O")
  }

  useEffect(() => {
    if (endGame){
        gameOver();
      }
    },[gameOver, endGame]
  );

  function handleClick(i){
    console.log("Current Board Values: "+boardValues)
    if (boardValues[i] || winner || draw){
      return;
    }
    //Make copy of current board
    const newBoardValues = boardValues.slice();
    if (xIsNext){
      newBoardValues[i] =  'X';
    } else {
      newBoardValues[i] =  'O';
    }
    onPlay(newBoardValues)
  }

  function boardFull(){
    for (let i=0; i < boardValues.length; i++){
      if (!boardValues[i]){
        return false
      }
    }
    return true
  }

  function calculateWinner(squares) {
    console.log(squares)
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  return (
    <>
      <div className='status'>{status}</div>
      <div className='board-row'>
        <Cell value={boardValues[0]} onCellClick={() => handleClick(0)}/>
        <Cell value={boardValues[1]} onCellClick={() => handleClick(1)}/>
        <Cell value={boardValues[2]} onCellClick={() => handleClick(2)}/>
      </div>
      <div className='board-row'>
        <Cell value={boardValues[3]} onCellClick={() => handleClick(3)}/> 
        <Cell value={boardValues[4]} onCellClick={() => handleClick(4)}/>
        <Cell value={boardValues[5]} onCellClick={() => handleClick(5)}/>
      </div>
      <div className='board-row'>
        <Cell value={boardValues[6]} onCellClick={() => handleClick(6)}/>
        <Cell value={boardValues[7]} onCellClick={() => handleClick(7)}/>
        <Cell value={boardValues[8]} onCellClick={() => handleClick(8)}/>
      </div>
    </>
    
  )
}

export default function TicTacToe(){
  // Maintain game history
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentBoardValues = history[currentMove];
  // Maintain player state (who's turn is it to move)
  const xIsNext = currentMove % 2 == 0;

  //Handle when game ends
  const newGame = () =>{
    //Reset state: 
    setCurrentMove(0)
    setHistory([Array(9).fill(null)])
    console.log("Let's start a new game")
  }
  const gameOver = () => {
    console.log("game is over")
    // TODO: Add popup and ask if they want to start over
    // newGame()
  }

  function handlePlay(updatedValues){
    const updatedHistory = [...history.slice(0, currentMove+1), updatedValues]
    setHistory(updatedHistory)
    setCurrentMove(updatedHistory.length-1)
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const moves = history.map((boardVals, move) => {
      let description 
      if (move > 0){
        description = "Go to move #" + move;
      }else { 
        description = 'Go to game start';
      }
      return (
        <li key={move}> 
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      )
    }
  )

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} boardValues={currentBoardValues} onPlay={handlePlay} gameOver={gameOver}/>
      </div>
      <div className='game-info'>
        <button onClick={newGame}>New Game</button>
        <h3>Game History:</h3>
        <hr/>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}