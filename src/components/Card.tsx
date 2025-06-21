import React, { useState, useEffect } from 'react';
import { Card as CardType } from '../types/game';
import './Card.css';

interface CardProps {
  card: CardType;
  isHidden?: boolean;
  isDealerCard?: boolean;
  shouldReveal?: boolean;
  delay?: number;
}

const Card: React.FC<CardProps> = ({ 
  card, 
  isHidden = false, 
  isDealerCard = false, 
  shouldReveal = false,
  delay = 0 
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay the card entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (shouldReveal && isHidden && isDealerCard) {
      // Start flip animation after a short delay
      const flipTimer = setTimeout(() => {
        setIsFlipping(true);
      }, 200);
      return () => clearTimeout(flipTimer);
    }
  }, [shouldReveal, isHidden, isDealerCard]);

  const getSuitSymbol = (suit: string): string => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getSuitColor = (suit: string): string => {
    return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
  };

  if (!isVisible) {
    return <div className="card card-placeholder" style={{ opacity: 0 }} />;
  }

  if (isHidden && isDealerCard) {
    return (
      <div className={`card card-hidden ${isFlipping ? 'flipping' : ''}`}>
        <div className="card-back">
          <div className="card-pattern">🂠</div>
        </div>
        <div className={`card-front card-${getSuitColor(card.suit)}`}>
          <div className="card-rank">{card.rank}</div>
          <div className="card-suit">{getSuitSymbol(card.suit)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card card-${getSuitColor(card.suit)}`}>
      <div className="card-rank">{card.rank}</div>
      <div className="card-suit">{getSuitSymbol(card.suit)}</div>
    </div>
  );
};

export default Card; 