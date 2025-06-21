import React from 'react';
import { GameStats } from '../types/game';
import './Statistics.css';

interface StatisticsProps {
  stats: GameStats;
}

const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  return (
    <div className="statistics">
      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-label">Games:</span>
          <span className="stat-value">{stats.totalGames}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Wins:</span>
          <span className="stat-value wins">{stats.wins}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Losses:</span>
          <span className="stat-value losses">{stats.losses}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pushes:</span>
          <span className="stat-value pushes">{stats.pushes}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Win Rate:</span>
          <span className="stat-value percentage">{stats.winPercentage}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Streak:</span>
          <span className="stat-value streak">{stats.currentStreak}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Best:</span>
          <span className="stat-value streak">{stats.bestStreak}</span>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 