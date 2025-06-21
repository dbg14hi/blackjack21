import { useState } from 'react';
import { GameAction } from '../types/game';

export const useBetting = (dispatch: React.Dispatch<GameAction>) => {
  const [isBetting, setIsBetting] = useState(false);

  const handleBet = async (amount: number) => {
    if (isBetting) return; // Prevent multiple bets
    
    setIsBetting(true);
    dispatch({ type: 'PLACE_BET', amount });
    
    // Add a small delay to prevent rapid clicking
    setTimeout(() => {
      setIsBetting(false);
    }, 500);
  };

  const handleCustomBetChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    dispatch({ type: 'SET_CUSTOM_BET', amount: numericValue });
  };

  const handlePlaceCustomBet = async () => {
    if (isBetting) return; // Prevent multiple bets
    
    setIsBetting(true);
    dispatch({ type: 'PLACE_CUSTOM_BET' });
    
    // Add a small delay to prevent rapid clicking
    setTimeout(() => {
      setIsBetting(false);
    }, 500);
  };

  const handleHalfBet = async (balance: number) => {
    if (isBetting || balance <= 0) return;
    
    const halfAmount = Math.floor(balance / 2);
    if (halfAmount <= 0) return;
    
    setIsBetting(true);
    dispatch({ type: 'PLACE_BET', amount: halfAmount });
    
    setTimeout(() => {
      setIsBetting(false);
    }, 500);
  };

  const handleMaxBet = async (balance: number) => {
    if (isBetting || balance <= 0) return;
    
    setIsBetting(true);
    dispatch({ type: 'PLACE_BET', amount: balance });
    
    setTimeout(() => {
      setIsBetting(false);
    }, 500);
  };

  const resetBetting = () => {
    setIsBetting(false);
  };

  return {
    isBetting,
    handleBet,
    handleCustomBetChange,
    handlePlaceCustomBet,
    handleHalfBet,
    handleMaxBet,
    resetBetting
  };
}; 