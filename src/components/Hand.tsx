import React from 'react';
import { Hand as HandType } from '../types/game';
import Card from './Card';
import './Hand.css';

interface HandProps {
  hand: HandType;
  title: string;
  isDealer?: boolean;
  showHiddenCard?: boolean;
  isGameFinished?: boolean;
  bet?: number;
}

const Hand: React.FC<HandProps> = ({ 
  hand, 
  title, 
  isDealer = false, 
  showHiddenCard = false, 
  isGameFinished = false,
  bet = 0
}) => {
  const getVisibleValue = (): number => {
    if (!isDealer || showHiddenCard) {
      return hand.value;
    }
    // Only show value of first card for dealer when second card is hidden
    return hand.cards.length > 0 ? hand.cards[0].value : 0;
  };

  const getStatusText = (): string => {
    if (hand.isBlackjack) return 'Blackjack!';
    if (hand.isBusted) return 'Busted!';
    
    const visibleValue = getVisibleValue();
    if (isDealer && !showHiddenCard && hand.cards.length > 1) {
      return `Value: ${visibleValue}?`;
    }
    return `Value: ${visibleValue}`;
  };

  const getStatusClass = (): string => {
    if (hand.isBlackjack) return 'status-blackjack';
    if (hand.isBusted) return 'status-busted';
    return 'status-normal';
  };

  const getHandClass = (): string => {
    const baseClass = 'hand';
    if (!isDealer && hand.isBlackjack && isGameFinished) {
      return `${baseClass} blackjack-celebration`;
    }
    return baseClass;
  };

  return (
    <div className={getHandClass()}>
      <div className="hand-header">
        <h3 className="hand-title">{title}</h3>
        {!isDealer && bet > 0 && (
          <div className="hand-bet">
            Bet: ${bet}
          </div>
        )}
        <div className={`hand-status ${getStatusClass()}`}>
          {getStatusText()}
        </div>
      </div>
      <div className="hand-cards">
        {hand.cards.map((card, index) => (
          <Card
            key={`${card.suit}-${card.rank}-${index}`}
            card={card}
            isHidden={isDealer && index === 1 && !showHiddenCard}
            isDealerCard={isDealer}
            shouldReveal={showHiddenCard && isDealer && index === 1}
            delay={index * 50} // Reduced delay for faster card appearance
          />
        ))}
      </div>
    </div>
  );
};

export default Hand; 