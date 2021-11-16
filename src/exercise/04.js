// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board() {
  const [moves, setMoves] = useLocalStorageState('moves', [])
  const [currentPosition, setCurrentPosition] = React.useState(-1)

  const squares = calculateSquares(moves, currentPosition)
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(index) {
    if (winner || squares[index]) {
      return
    }
    const copyOfMoves = moves.slice(0, currentPosition + 1)
    copyOfMoves.push([nextValue, index])
    setMoves(copyOfMoves)
    setCurrentPosition(prev => prev + 1)
  }

  function restart() {
    setCurrentPosition(-1)
    setMoves([])
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div style={{display: 'flex'}}>
      <div>
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div style={{marginLeft: 20}}>
        <div className="status">{status}</div>
        <ol>
          <li>
            <button
              disabled={currentPosition === -1}
              onClick={() => {
                setCurrentPosition(-1)
              }}
            >
              Go to game start
            </button>
          </li>
          <div>
            {moves.map((move, index) => (
              <li key={move[1]}>
                <button
                  onClick={() => {
                    setCurrentPosition(index)
                  }}
                  disabled={currentPosition === index}
                >
                  Go to move #{index + 1}
                  {currentPosition === index && ' (current)'}
                </button>
              </li>
            ))}
          </div>
        </ol>
      </div>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

function calculateSquares(moves, until) {
  return moves.reduce((squares, current, index) => {
    if (index <= until) {
      squares[current[1]] = current[0]
    }
    return squares
  }, Array(9).fill(null))
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
