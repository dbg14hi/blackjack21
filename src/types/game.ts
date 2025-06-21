export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
  isAce: boolean;
}

export interface Hand {
  cards: Card[];
  value: number;
  isBusted: boolean;
  isBlackjack: boolean;
}

export interface GameStats {
  wins: number;
  losses: number;
  pushes: number;
  totalGames: number;
  winPercentage: number;
  currentStreak: number;
  bestStreak: number;
}

export interface GameState {
  deck: Card[];
  playerHand: Hand;
  dealerHand: Hand;
  gameStatus: 'betting' | 'playing' | 'dealerTurn' | 'dealerRevealing' | 'finished';
  result: 'playerWin' | 'dealerWin' | 'push' | null;
  bet: number;
  balance: number;
  stats: GameStats;
  customBetAmount: string;
}

export type GameAction = 
  | { type: 'DEAL_CARDS' }
  | { type: 'HIT' }
  | { type: 'STAND' }
  | { type: 'DOUBLE_DOWN' }
  | { type: 'NEW_GAME' }
  | { type: 'PLACE_BET'; amount: number }
  | { type: 'UPDATE_DEALER_HAND'; hand: Hand; deck: Card[] }
  | { type: 'SET_RESULT'; result: 'playerWin' | 'dealerWin' | 'push' }
  | { type: 'UPDATE_BALANCE'; balance: number }
  | { type: 'SET_GAME_STATUS'; status: GameState['gameStatus'] }
  | { type: 'UPDATE_STATS'; result: 'playerWin' | 'dealerWin' | 'push' }
  | { type: 'SET_CUSTOM_BET'; amount: string }
  | { type: 'PLACE_CUSTOM_BET' }
  | { type: 'REVEAL_DEALER_CARD' }; 