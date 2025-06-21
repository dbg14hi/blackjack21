import React from 'react';
import { GameState } from '../types/game';
import './BlackjackGame.css';

interface GameControlsProps {
  state: GameState;
  onHit: () => void;
  onStand: () => void;
  onDoubleDown: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ state, onHit, onStand, onDoubleDown }) => {
  return (
    <div className="game-controls">
      <button onClick={onHit} className="control-button hit">Hit</button>
      <button onClick={onStand} className="control-button stand">Stand</button>
      {state.playerHand.cards.length === 2 && state.balance >= state.bet && (
        <button onClick={onDoubleDown} className="control-button double-down">Double Down</button>
      )}
      {state.playerHand.value === 21 && (
        <div className="auto-advance-message">
          🎯 You have 21! Automatically advancing to dealer's turn...
        </div>
      )}
    </div>
  );
};

export default GameControls; 