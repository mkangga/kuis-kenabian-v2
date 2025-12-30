import React from 'react';
import { Sparkles, Clock, Volume2, Home } from 'lucide-react';
import { GameState } from '../types';

interface HeaderProps {
  gameState: GameState;
  timeLeft: number;
  useTimer: boolean;
  onGoHome: () => void;
  formatTime: (seconds: number) => string;
}

const Header: React.FC<HeaderProps> = ({ gameState, timeLeft, useTimer, onGoHome, formatTime }) => {
  return (
    <div className="w-full bg-emerald-600 p-4 text-white flex justify-between items-center shadow-md z-50 sticky top-0">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-300" />
        <h1 className="font-bold text-lg tracking-wide">Kuis Kenabian</h1>
      </div>
      {gameState !== 'menu' && (
        <div className="flex items-center gap-3">
          {/* Timer Display in Header */}
          {gameState === 'playing' && useTimer && (
            <div className={`flex items-center gap-1 font-mono text-sm px-3 py-1 rounded-full ${timeLeft <= 15 ? 'bg-red-500 animate-pulse' : timeLeft < 30 ? 'bg-amber-500' : 'bg-emerald-700'}`}>
              {timeLeft <= 15 ? <Volume2 className="w-3 h-3 animate-bounce" /> : <Clock className="w-3 h-3" />}
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
          <button onClick={onGoHome} className="p-2 hover:bg-emerald-700 rounded-full transition">
            <Home className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;