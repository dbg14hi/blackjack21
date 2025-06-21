import { Card, Suit, Rank, Hand, GameState, GameAction, GameStats } from '../types/game';

// Create a fresh deck of 52 cards
export const createDeck = (): Card[] => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  suits.forEach(suit => {
    ranks.forEach(rank => {
      const isAce = rank === 'A';
      const value = isAce ? 11 : (rank === 'J' || rank === 'Q' || rank === 'K') ? 10 : parseInt(rank);
      
      deck.push({
        suit,
        rank,
        value,
        isAce
      });
    });
  });

  return shuffleDeck(deck);
};

// Fisher-Yates shuffle algorithm
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Deal a card from the deck
export const dealCard = (deck: Card[]): { card: Card; newDeck: Card[] } => {
  if (deck.length === 0) {
    throw new Error('No cards left in deck');
  }
  const card = deck[0];
  const newDeck = deck.slice(1);
  return { card, newDeck };
};

// Calculate hand value (handles aces properly)
export const calculateHandValue = (cards: Card[]): number => {
  let value = 0;
  let aces = 0;

  cards.forEach(card => {
    if (card.isAce) {
      aces += 1;
      value += 11;
    } else {
      value += card.value;
    }
  });

  // Convert aces from 11 to 1 if needed
  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
};

// Create an empty hand
export const createEmptyHand = (): Hand => ({
  cards: [],
  value: 0,
  isBusted: false,
  isBlackjack: false
});

// Add a card to a hand and recalculate
export const addCardToHand = (hand: Hand, card: Card): Hand => {
  const newCards = [...hand.cards, card];
  const value = calculateHandValue(newCards);
  
  return {
    cards: newCards,
    value,
    isBusted: value > 21,
    isBlackjack: value === 21 && newCards.length === 2
  };
};

// Deal initial cards
export const dealInitialCards = (deck: Card[]): {
  playerHand: Hand;
  dealerHand: Hand;
  newDeck: Card[];
} => {
  let currentDeck = [...deck];
  
  // Deal first card to player
  const { card: playerCard1, newDeck: deck1 } = dealCard(currentDeck);
  currentDeck = deck1;
  
  // Deal first card to dealer
  const { card: dealerCard1, newDeck: deck2 } = dealCard(currentDeck);
  currentDeck = deck2;
  
  // Deal second card to player
  const { card: playerCard2, newDeck: deck3 } = dealCard(currentDeck);
  currentDeck = deck3;
  
  // Deal second card to dealer (face down)
  const { card: dealerCard2, newDeck: deck4 } = dealCard(currentDeck);
  currentDeck = deck4;

  const playerHand = addCardToHand(addCardToHand(createEmptyHand(), playerCard1), playerCard2);
  const dealerHand = addCardToHand(addCardToHand(createEmptyHand(), dealerCard1), dealerCard2);

  return { playerHand, dealerHand, newDeck: currentDeck };
};

// Dealer AI - hit on 16 or less, stand on 17 or more
export const shouldDealerHit = (dealerHand: Hand): boolean => {
  return dealerHand.value < 17;
};

// Determine game result
export const determineResult = (playerHand: Hand, dealerHand: Hand): 'playerWin' | 'dealerWin' | 'push' => {
  if (playerHand.isBusted) return 'dealerWin';
  if (dealerHand.isBusted) return 'playerWin';
  if (playerHand.isBlackjack && !dealerHand.isBlackjack) return 'playerWin';
  if (dealerHand.isBlackjack && !playerHand.isBlackjack) return 'dealerWin';
  if (playerHand.isBlackjack && dealerHand.isBlackjack) return 'push';
  
  if (playerHand.value > dealerHand.value) return 'playerWin';
  if (dealerHand.value > playerHand.value) return 'dealerWin';
  return 'push';
};

// Create initial game statistics
export const createInitialStats = (): GameStats => ({
  wins: 0,
  losses: 0,
  pushes: 0,
  totalGames: 0,
  winPercentage: 0,
  currentStreak: 0,
  bestStreak: 0
});

// Update statistics based on game result
export const updateStats = (currentStats: GameStats, result: 'playerWin' | 'dealerWin' | 'push'): GameStats => {
  const newStats = { ...currentStats };
  
  switch (result) {
    case 'playerWin':
      newStats.wins += 1;
      newStats.currentStreak += 1;
      newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
      break;
    case 'dealerWin':
      newStats.losses += 1;
      newStats.currentStreak = 0;
      break;
    case 'push':
      newStats.pushes += 1;
      newStats.currentStreak = 0;
      break;
  }
  
  newStats.totalGames = newStats.wins + newStats.losses + newStats.pushes;
  newStats.winPercentage = newStats.totalGames > 0 ? Math.round((newStats.wins / newStats.totalGames) * 100) : 0;
  
  return newStats;
};

// Game reducer for state management
export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'PLACE_BET':
      if (action.amount <= state.balance && action.amount > 0) {
        return {
          ...state,
          bet: action.amount,
          balance: state.balance - action.amount
        };
      }
      return state;

    case 'DEAL_CARDS':
      if (state.bet === 0) return state;
      
      const { playerHand, dealerHand, newDeck } = dealInitialCards(state.deck);
      
      // Check for immediate blackjack
      let initialGameStatus: GameState['gameStatus'] = 'playing';
      let initialResult: GameState['result'] = null;
      
      if (playerHand.isBlackjack) {
        // Player has blackjack - check if dealer also has blackjack
        if (dealerHand.isBlackjack) {
          initialGameStatus = 'finished';
          initialResult = 'push';
        } else {
          initialGameStatus = 'finished';
          initialResult = 'playerWin';
        }
      } else if (dealerHand.isBlackjack) {
        // Dealer has blackjack but player doesn't - dealer wins
        initialGameStatus = 'finished';
        initialResult = 'dealerWin';
      }
      
      return {
        ...state,
        deck: newDeck,
        playerHand,
        dealerHand,
        gameStatus: initialGameStatus,
        result: initialResult
      };

    case 'HIT':
      if (state.gameStatus !== 'playing') return state;
      
      const { card: hitCard, newDeck: hitDeck } = dealCard(state.deck);
      const newPlayerHand = addCardToHand(state.playerHand, hitCard);
      
      let newGameStatus: GameState['gameStatus'] = state.gameStatus;
      let newResult = state.result;
      
      if (newPlayerHand.isBusted) {
        newGameStatus = 'finished';
        newResult = 'dealerWin';
      } else if (newPlayerHand.isBlackjack) {
        newGameStatus = 'dealerTurn';
      } else if (newPlayerHand.value === 21) {
        // Auto-advance to dealer's turn when player hits 21
        newGameStatus = 'dealerTurn';
      }
      
      return {
        ...state,
        deck: hitDeck,
        playerHand: newPlayerHand,
        gameStatus: newGameStatus,
        result: newResult
      };

    case 'STAND':
      if (state.gameStatus !== 'playing') return state;
      
      return {
        ...state,
        gameStatus: 'dealerTurn'
      };

    case 'DOUBLE_DOWN':
      if (state.gameStatus !== 'playing') return state;
      
      // Check if player has exactly 2 cards (required for double down)
      if (state.playerHand.cards.length !== 2) return state;
      
      // Check if player has enough balance to double the bet
      if (state.balance < state.bet) return state;
      
      // Double the bet and deduct from balance
      const doubledBet = state.bet * 2;
      const newBalance = state.balance - state.bet;
      
      // Deal exactly one card to player
      const { card: doubleCard, newDeck: doubleDeck } = dealCard(state.deck);
      const doubledPlayerHand = addCardToHand(state.playerHand, doubleCard);
      
      let doubleGameStatus: GameState['gameStatus'] = 'dealerTurn';
      let doubleResult = state.result;
      
      // Check if player busted after double down
      if (doubledPlayerHand.isBusted) {
        doubleGameStatus = 'finished';
        doubleResult = 'dealerWin';
      }
      
      return {
        ...state,
        deck: doubleDeck,
        playerHand: doubledPlayerHand,
        bet: doubledBet,
        balance: newBalance,
        gameStatus: doubleGameStatus,
        result: doubleResult
      };

    case 'NEW_GAME':
      return {
        deck: createDeck(),
        playerHand: createEmptyHand(),
        dealerHand: createEmptyHand(),
        gameStatus: 'betting',
        result: null,
        bet: 0,
        balance: state.balance,
        stats: state.stats,
        customBetAmount: ''
      };

    case 'UPDATE_DEALER_HAND':
      return {
        ...state,
        dealerHand: action.hand,
        deck: action.deck
      };

    case 'SET_RESULT':
      return {
        ...state,
        result: action.result
      };

    case 'UPDATE_BALANCE':
      return {
        ...state,
        balance: action.balance
      };

    case 'SET_GAME_STATUS':
      return {
        ...state,
        gameStatus: action.status
      };

    case 'UPDATE_STATS':
      return {
        ...state,
        stats: updateStats(state.stats, action.result)
      };

    case 'SET_CUSTOM_BET':
      return {
        ...state,
        customBetAmount: action.amount
      };

    case 'PLACE_CUSTOM_BET':
      const customAmount = parseInt(state.customBetAmount);
      if (customAmount > 0 && customAmount <= state.balance) {
        return {
          ...state,
          bet: customAmount,
          balance: state.balance - customAmount,
          customBetAmount: ''
        };
      }
      return state;

    case 'REVEAL_DEALER_CARD':
      return {
        ...state,
        gameStatus: 'dealerRevealing'
      };

    default:
      return state;
  }
}; 