import React from 'react';
import { GameState } from '../types/game';
import { getResultMessage, getResultClass } from '../utils/gameHelpers';
import './BlackjackGame.css';

interface GameResultProps {
  state: GameState;
  onNewGame: () => void;
}

const GameResult: React.FC<GameResultProps> = ({ state, onNewGame }) => {
  return (
    <div className="game-result">
      <div className={`result-message ${getResultClass(state.result)}`}>
        {getResultMessage(state.result, state.playerHand.isBlackjack)}
      </div>
      {state.playerHand.isBlackjack && state.result === 'playerWin' && (
        <div className="blackjack-bonus">
          🎉 Blackjack pays 3:2! +${Math.round(state.bet * 1.5)} 🎉
        </div>
      )}
      <button onClick={onNewGame} className="new-game-button">
        New Game
      </button>
    </div>
  );
};

export default GameResult; 