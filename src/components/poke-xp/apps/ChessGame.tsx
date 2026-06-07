import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess, Square, Move } from 'chess.js';

const PIECE_IMAGES: Record<string, string> = {
  'w-p': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/7.png', // Squirtle
  'w-n': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/58.png', // Growlithe
  'w-b': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/64.png', // Kadabra
  'w-r': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/68.png', // Machamp
  'w-q': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/31.png', // Nidoqueen
  'w-k': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/34.png', // Nidoking
  'b-p': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/23.png', // Ekans
  'b-n': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/52.png', // Meowth
  'b-b': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/94.png', // Gengar
  'b-r': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/110.png', // Weezing
  'b-q': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/53.png', // Persian
  'b-k': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/150.png', // Mewtwo
};

const PIECE_VALUES: Record<string, number> = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 90,
  k: 900
};

const evaluateBoard = (game: Chess) => {
  let totalEvaluation = 0;
  const board = game.board();
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const val = PIECE_VALUES[piece.type] || 0;
        totalEvaluation += piece.color === 'w' ? val : -val;
      }
    }
  }
  return totalEvaluation;
};

const minimax = (game: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): number => {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = game.moves();

  if (isMaximizing) {
    let bestVal = -Infinity;
    for (const move of moves) {
      game.move(move);
      bestVal = Math.max(bestVal, minimax(game, depth - 1, alpha, beta, !isMaximizing));
      game.undo();
      alpha = Math.max(alpha, bestVal);
      if (beta <= alpha) break;
    }
    return bestVal;
  } else {
    let bestVal = Infinity;
    for (const move of moves) {
      game.move(move);
      bestVal = Math.min(bestVal, minimax(game, depth - 1, alpha, beta, !isMaximizing));
      game.undo();
      beta = Math.min(beta, bestVal);
      if (beta <= alpha) break;
    }
    return bestVal;
  }
};

const getBestMove = (game: Chess, depth: number = 3) => {
  const moves = game.moves();
  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let bestValue = game.turn() === 'w' ? -Infinity : Infinity;

  // Shuffle moves to add some randomness to equal evaluations
  moves.sort(() => Math.random() - 0.5);

  for (const move of moves) {
    game.move(move);
    const boardValue = minimax(game, depth - 1, -Infinity, Infinity, game.turn() === 'w');
    game.undo();

    if (game.turn() === 'w') {
      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    } else {
      if (boardValue < bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    }
  }

  return bestMove;
};

export const ChessGame: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState(game.board());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [status, setStatus] = useState('Your turn');

  const updateStatus = useCallback((currentGame: Chess) => {
    if (currentGame.isCheckmate()) {
      setStatus(`Checkmate! ${currentGame.turn() === 'w' ? 'Black' : 'White'} wins!`);
    } else if (currentGame.isDraw()) {
      setStatus('Draw!');
    } else if (currentGame.isStalemate()) {
      setStatus('Stalemate!');
    } else if (currentGame.isCheck()) {
      setStatus('Check!');
    } else {
      setStatus(currentGame.turn() === 'w' ? 'Your turn (White)' : 'Opponent\'s turn (Black)');
    }
    setBoard(currentGame.board());
  }, []);

  const makeBotMove = useCallback(() => {
    setIsThinking(true);
    setStatus('Opponent is thinking...');
    
    // Use timeout to allow UI to render the "thinking" state
    setTimeout(() => {
      const bestMove = getBestMove(game, 2); // Depth 2 for acceptable performance in JS
      if (bestMove) {
        game.move(bestMove);
        const newGame = new Chess(game.fen());
        setGame(newGame);
        updateStatus(newGame);
      }
      setIsThinking(false);
    }, 100);
  }, [game, updateStatus]);

  useEffect(() => {
    if (game.turn() === 'b' && !game.isGameOver()) {
      makeBotMove();
    }
  }, [game, makeBotMove]);

  const onSquareClick = (square: Square) => {
    if (game.turn() === 'b' || isThinking || game.isGameOver()) return;

    if (selectedSquare) {
      // Try to make a move
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q' // Always promote to queen for simplicity
        });

        if (move) {
          const newGame = new Chess(game.fen());
          setGame(newGame);
          setSelectedSquare(null);
          setValidMoves([]);
          updateStatus(newGame);
        } else {
          // Clicked somewhere invalid or selected another piece
          handleSquareSelection(square);
        }
      } catch (e) {
        // Invalid move exception
        handleSquareSelection(square);
      }
    } else {
      handleSquareSelection(square);
    }
  };

  const handleSquareSelection = (square: Square) => {
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      setValidMoves(game.moves({ square, verbose: true }) as Move[]);
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  // 8x8 squares
  const renderBoard = () => {
    const squares = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const squareId = `${files[f]}${ranks[r]}` as Square;
        const piece = board[r][f];
        const isLight = (r + f) % 2 === 0;
        const isSelected = selectedSquare === squareId;
        const isMoveTarget = validMoves.some(m => m.to === squareId);
        
        let bgColor = isLight ? '#f0ebd9' : '#8b9bb4';
        if (isSelected) bgColor = '#fafa6e';
        else if (isMoveTarget) {
          bgColor = isLight ? '#b8d8ad' : '#7ba876';
        }

        squares.push(
          <div
            key={squareId}
            onClick={() => onSquareClick(squareId)}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (selectedSquare !== squareId) {
                onSquareClick(squareId);
              }
            }}
            className="w-[40px] h-[40px] flex items-center justify-center relative cursor-pointer"
            style={{ backgroundColor: bgColor }}
          >
            {piece && (
              <img
                src={PIECE_IMAGES[`${piece.color}-${piece.type}`]}
                alt={`${piece.color} ${piece.type}`}
                className="w-full h-full object-contain drop-shadow-md relative z-10"
                style={{ imageRendering: 'pixelated' }}
                draggable={piece.color === 'w' && game.turn() === 'w'}
                onDragStart={(e) => {
                  handleSquareSelection(squareId);
                  e.dataTransfer.setData('text/plain', squareId);
                  e.dataTransfer.effectAllowed = 'move';
                }}
              />
            )}
            {/* Rank and File labels */}
            {f === 0 && (
              <div className="absolute left-0.5 top-0 text-[10px] font-bold opacity-50 pointer-events-none">
                {ranks[r]}
              </div>
            )}
            {r === 7 && (
              <div className="absolute right-0.5 bottom-0 text-[10px] font-bold opacity-50 pointer-events-none">
                {files[f]}
              </div>
            )}
          </div>
        );
      }
    }
    return squares;
  };

  const restartGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setBoard(newGame.board());
    setSelectedSquare(null);
    setValidMoves([]);
    setStatus('Your turn (White)');
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#c8d4e6] p-2 select-none overflow-auto font-sans">
      <div className="bg-white border-2 border-[#8b9bb4] rounded p-2 mb-2 w-full max-w-[340px] shadow-sm flex justify-between items-center">
        <div className="text-sm font-bold text-[#4a5a73] truncate flex-1 mr-2">{status}</div>
        <button 
          onClick={restartGame}
          className="px-2 py-1 bg-[#4a5a73] text-white text-xs font-bold rounded hover:bg-[#38465c] active:bg-[#2b3648] border border-[#2b3648]"
        >
          Reset
        </button>
      </div>

      <div className="w-[328px] h-[328px] border-4 border-[#4a5a73] grid grid-cols-8 grid-rows-8 shadow-lg relative bg-[#8b9bb4]">
        {renderBoard()}
      </div>

      <div className="mt-4 flex gap-4 w-full max-w-[340px]">
        <div className="flex-1 bg-[#f0ebd9] p-2 border-2 border-[#8b9bb4] rounded shadow-sm">
          <div className="text-xs font-bold text-[#4a5a73] border-b border-[#8b9bb4] pb-1 mb-1">White (You)</div>
          <div className="flex flex-wrap gap-1">
             <img src={PIECE_IMAGES['w-n']} className="w-6 h-6" style={{ imageRendering: 'pixelated' }} />
             <div className="text-xs self-center">vs</div>
             <img src={PIECE_IMAGES['b-n']} className="w-6 h-6" style={{ imageRendering: 'pixelated' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
