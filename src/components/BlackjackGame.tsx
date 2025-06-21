"use client";
import React, { useEffect } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { useBetting } from '../hooks/useBetting';
import Statistics from './Statistics';
import BettingSection from './BettingSection';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import GameResult from './GameResult';
import './BlackjackGame.css';

const BlackjackGame: React.FC = () => {
  const { state, dispatch } = useGameLogic();
  const { resetBetting } = useBetting(dispatch);

  // Reset betting state when starting a new game
  useEffect(() => {
    if (state.gameStatus === 'betting') {
      resetBetting();
    }
  }, [state.gameStatus, resetBetting]);

  const handleDeal = () => {
    dispatch({ type: 'DEAL_CARDS' });
  };

  const handleHit = () => {
    dispatch({ type: 'HIT' });
  };

  const handleStand = () => {
    dispatch({ type: 'STAND' });
  };

  const handleDoubleDown = () => {
    dispatch({ type: 'DOUBLE_DOWN' });
  };

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
  };

  return (
    <div className="blackjack-game">
      <div className="game-header">
        <h1>Blackjack</h1>
        <div className="balance">Balance: ${state.balance}</div>
      </div>

      <Statistics stats={state.stats} />

      {state.gameStatus === 'betting' && (
        <BettingSection 
          state={state} 
          dispatch={dispatch} 
          onDeal={handleDeal} 
        />
      )}

      {(state.gameStatus === 'playing' || state.gameStatus === 'dealerTurn' || state.gameStatus === 'dealerRevealing' || state.gameStatus === 'finished') && (
        <>
          <GameBoard state={state} />

          {state.gameStatus === 'playing' && (
            <GameControls 
              state={state}
              onHit={handleHit}
              onStand={handleStand}
              onDoubleDown={handleDoubleDown}
            />
          )}

          {state.gameStatus === 'dealerRevealing' && (
            <div className="dealer-revealing-message">
              Revealing dealer&apos;s hidden card...
            </div>
          )}

          {state.gameStatus === 'dealerTurn' && (
            <div className="dealer-turn-message">
              Dealer&apos;s turn...
            </div>
          )}

          {state.gameStatus === 'finished' && (
            <GameResult 
              state={state} 
              onNewGame={handleNewGame} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default BlackjackGame; 