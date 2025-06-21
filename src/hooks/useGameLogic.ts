import { useReducer, useEffect, useRef } from 'react';
import { GameState } from '../types/game';
import { gameReducer, createDeck, createEmptyHand, dealCard, addCardToHand, shouldDealerHit, determineResult, createInitialStats } from '../utils/gameLogic';

export const useGameLogic = () => {
  const initialState: GameState = {
    deck: createDeck(),
    playerHand: createEmptyHand(),
    dealerHand: createEmptyHand(),
    gameStatus: 'betting',
    result: null,
    bet: 0,
    balance: 1000,
    stats: createInitialStats(),
    customBetAmount: ''
  };

  const [state, dispatch] = useReducer(gameReducer, initialState);
  const processedResultRef = useRef<string | null>(null);
  const balanceUpdatedRef = useRef<boolean>(false);

  // Handle dealer's turn when player stands
  useEffect(() => {
    if (state.gameStatus === 'dealerTurn') {
      const playDealerTurn = async () => {
        let currentDeck = [...state.deck];
        let currentDealerHand = { ...state.dealerHand };

        // First, reveal the hidden card with a shorter delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Update state to show the hidden card
        dispatch({ type: 'REVEAL_DEALER_CARD' } as any);
        
        // Wait for the flip animation to complete (reduced time)
        await new Promise(resolve => setTimeout(resolve, 800));

        // Dealer hits until 17 or higher
        while (shouldDealerHit(currentDealerHand)) {
          await new Promise(resolve => setTimeout(resolve, 600)); // Reduced delay for visual effect
          
          const { card, newDeck } = dealCard(currentDeck);
          currentDealerHand = addCardToHand(currentDealerHand, card);
          currentDeck = newDeck;

          // Update state with dealer's new hand
          dispatch({ type: 'UPDATE_DEALER_HAND', hand: currentDealerHand, deck: currentDeck } as any);
        }

        // Determine final result
        const result = determineResult(state.playerHand, currentDealerHand);
        
        // Update all state at once to prevent loops
        dispatch({ type: 'SET_RESULT', result } as any);
        dispatch({ type: 'SET_GAME_STATUS', status: 'finished' } as any);
      };

      playDealerTurn();
    }
  }, [state.gameStatus, state.deck, state.dealerHand, state.playerHand]);

  // Handle immediate game endings (blackjack, bust) and update balance/stats
  useEffect(() => {
    if (state.gameStatus === 'finished' && state.result) {
      const resultKey = `${state.result}-${state.bet}-${state.playerHand.isBlackjack}`;
      
      // Only process if we haven't processed this exact result yet
      if (processedResultRef.current !== resultKey && !balanceUpdatedRef.current) {
        processedResultRef.current = resultKey;
        balanceUpdatedRef.current = true;
        
        let newBalance = state.balance;
        
        if (state.result === 'playerWin') {
          const isBlackjack = state.playerHand.isBlackjack;
          const winAmount = state.bet * (isBlackjack ? 2.5 : 2);
          newBalance += winAmount;
        } else if (state.result === 'push') {
          newBalance += state.bet;
        }
        
        dispatch({ type: 'UPDATE_BALANCE', balance: newBalance } as any);
        dispatch({ type: 'UPDATE_STATS', result: state.result } as any);
      }
    }
  }, [state.gameStatus, state.result, state.bet, state.playerHand.isBlackjack, state.balance]);

  // Reset processed result when starting a new game
  useEffect(() => {
    if (state.gameStatus === 'betting') {
      processedResultRef.current = null;
      balanceUpdatedRef.current = false;
    }
  }, [state.gameStatus]);

  return { state, dispatch };
}; 