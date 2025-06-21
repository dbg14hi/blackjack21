export const getResultMessage = (result: string | null, isBlackjack: boolean) => {
  if (!result) return '';
  
  switch (result) {
    case 'playerWin':
      return isBlackjack ? 'Blackjack! You win!' : 'You win!';
    case 'dealerWin':
      return isBlackjack ? 'Dealer Blackjack! You lose!' : 'Dealer wins!';
    case 'push':
      return 'Push! It\'s a tie!';
    default:
      return '';
  }
};

export const getResultClass = (result: string | null) => {
  if (!result) return '';
  
  switch (result) {
    case 'playerWin':
      return 'result-win';
    case 'dealerWin':
      return 'result-lose';
    case 'push':
      return 'result-push';
    default:
      return '';
  }
}; 