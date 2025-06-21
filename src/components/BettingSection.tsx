import React from 'react';
import { GameState } from '../types/game';
import { useBetting } from '../hooks/useBetting';
import './BlackjackGame.css';

interface BettingSectionProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
  onDeal: () => void;
}

const BettingSection: React.FC<BettingSectionProps> = ({ state, dispatch, onDeal }) => {
  const {
    isBetting,
    handleBet,
    handleCustomBetChange,
    handlePlaceCustomBet,
    handleHalfBet,
    handleMaxBet
  } = useBetting(dispatch);

  return (
    <div className="betting-section">
      <h2>Place Your Bet</h2>
      
      <div className="bet-options">
        <button 
          onClick={() => handleBet(10)} 
          disabled={state.balance < 10 || isBetting || state.bet > 0}
        >
          $10
        </button>
        <button 
          onClick={() => handleBet(25)} 
          disabled={state.balance < 25 || isBetting || state.bet > 0}
        >
          $25
        </button>
        <button 
          onClick={() => handleBet(50)} 
          disabled={state.balance < 50 || isBetting || state.bet > 0}
        >
          $50
        </button>
        <button 
          onClick={() => handleBet(100)} 
          disabled={state.balance < 100 || isBetting || state.bet > 0}
        >
          $100
        </button>
        <button 
          onClick={() => handleHalfBet(state.balance)}
          disabled={state.balance <= 0 || isBetting || state.bet > 0}
          className="half-bet-button"
        >
          ½ Balance
        </button>
        <button 
          onClick={() => handleMaxBet(state.balance)}
          disabled={state.balance <= 0 || isBetting || state.bet > 0}
          className="max-bet-button"
        >
          Max Bet
        </button>
      </div>

      <div className="custom-bet-section">
        <div className="custom-bet-input">
          <label htmlFor="custom-bet">Custom Bet:</label>
          <input
            id="custom-bet"
            type="text"
            value={state.customBetAmount}
            onChange={(e) => handleCustomBetChange(e.target.value)}
            placeholder="Enter amount..."
            maxLength={6}
            disabled={isBetting || state.bet > 0}
          />
          <button 
            onClick={handlePlaceCustomBet}
            disabled={
              !state.customBetAmount || 
              parseInt(state.customBetAmount) <= 0 || 
              parseInt(state.customBetAmount) > state.balance ||
              isBetting ||
              state.bet > 0
            }
            className="custom-bet-button"
          >
            Place Bet
          </button>
        </div>
        {state.customBetAmount && (
          <div className="custom-bet-validation">
            {parseInt(state.customBetAmount) > state.balance ? (
              <span className="error">Insufficient funds!</span>
            ) : parseInt(state.customBetAmount) <= 0 ? (
              <span className="error">Bet must be greater than 0!</span>
            ) : (
              <span className="valid">Valid bet amount</span>
            )}
          </div>
        )}
      </div>

      {state.bet > 0 && (
        <div className="current-bet">
          <p>Current bet: ${state.bet}</p>
          <button onClick={onDeal} className="deal-button">Deal Cards</button>
        </div>
      )}
    </div>
  );
};

export default BettingSection; 