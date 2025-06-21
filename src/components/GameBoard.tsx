import React from 'react';
import { GameState } from '../types/game';
import Hand from './Hand';
import './BlackjackGame.css';

interface GameBoardProps {
  state: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ state }) => {
  return (
    <>
      <Hand
        hand={state.dealerHand}
        title="Dealer"
        isDealer={true}
        showHiddenCard={state.gameStatus === 'finished' || state.dealerHand.isBlackjack || state.gameStatus === 'dealerRevealing'}
        isGameFinished={state.gameStatus === 'finished'}
      />
      
      <Hand
        hand={state.playerHand}
        title="Player"
        isDealer={false}
        isGameFinished={state.gameStatus === 'finished'}
        bet={state.bet}
      />
    </>
  );
};

export default GameBoard; 