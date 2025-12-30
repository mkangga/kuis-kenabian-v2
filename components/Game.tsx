import React from 'react';
import { RotateCw, CheckCircle, XCircle, SkipForward, Eye } from 'lucide-react';
import { Question } from '../types';
import { CATEGORIES } from '../constants';

interface GameProps {
  currentQuestion: Question;
  remainingCount: number;
  totalInitial: number;
  categoryId: string | null;
  isFlipped: boolean;
  onFlip: () => void;
  onSkip: () => void;
  onAnswer: (isCorrect: boolean) => void;
}

const Game: React.FC<GameProps> = ({ 
  currentQuestion, 
  remainingCount,
  totalInitial,
  categoryId, 
  isFlipped, 
  onFlip, 
  onSkip,
  onAnswer
}) => {
  const categoryName = CATEGORIES.find(c => c.id === categoryId)?.name;
  
  // Calculate progress (completed / total)
  const completedCount = totalInitial - remainingCount;
  // If we just started, 0 completed. If queue is empty (handled by parent), then all done.
  const progressPercent = (completedCount / totalInitial) * 100;

  // --- Styles ---
  // Removed 'transform' class to prevent conflict with custom 'rotate-y-180' class
  // Removed z-index classes to allow natural 3D stacking context
  const cardClass = `relative w-full h-80 md:h-96 transition-all duration-500 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`;
  const faceClass = "absolute w-full h-full backface-hidden rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 text-center border-4";
  const frontClass = `${faceClass} bg-white border-emerald-100`;
  const backClass = `${faceClass} bg-emerald-600 border-emerald-700 text-white rotate-y-180`;

  return (
    <div className="w-full h-full flex flex-col justify-center animate-fade-in max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-bold text-gray-500 mb-3">
          <span>Tersisa: {remainingCount} Soal</span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
            {categoryName}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-emerald-500 h-3 rounded-full transition-all duration-300" 
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard Area */}
      <div className="perspective-1000 w-full mb-10">
        <div 
          className={cardClass}
          onClick={() => !isFlipped && onFlip()}
        >
          {/* Front Side (Question) */}
          <div className={frontClass}>
            <div className="absolute top-6 left-6">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Pertanyaan</span>
            </div>
            <h3 className="text-xl md:text-3xl font-bold text-gray-800 leading-relaxed max-w-lg">
              {currentQuestion?.q}
            </h3>
            <div className="absolute bottom-8 text-gray-400 text-sm flex items-center gap-2 animate-pulse">
              <RotateCw className="w-4 h-4" /> Ketuk untuk melihat jawaban
            </div>
          </div>

          {/* Back Side (Answer) */}
          <div className={backClass}>
            <div className="absolute top-6 left-6">
              <span className="bg-emerald-800/30 text-emerald-50 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-emerald-400/30">Jawaban</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-bold text-white leading-relaxed max-w-lg">
              {currentQuestion?.a}
            </h3>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center items-center w-full">
        {!isFlipped ? (
          <>
            {/* Control State 1: Before Flip */}
            <button 
              onClick={(e) => { e.stopPropagation(); onSkip(); }}
              disabled={remainingCount <= 1}
              className={`flex-1 py-4 font-bold text-lg rounded-2xl shadow-sm border transition flex justify-center items-center gap-2 ${
                remainingCount <= 1 
                ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed" 
                : "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 active:scale-95"
              }`}
            >
              <SkipForward className="w-5 h-5" /> Lewati Dulu
            </button>

            <button 
              onClick={onFlip}
              className="flex-1 py-4 bg-white border border-gray-300 text-gray-700 font-bold text-lg rounded-2xl shadow-sm hover:bg-gray-50 active:scale-95 transition hover:shadow-md flex justify-center items-center gap-2"
            >
              <Eye className="w-5 h-5" /> Lihat Jawaban
            </button>
          </>
        ) : (
          <>
            {/* Control State 2: After Flip (Scoring) */}
            <button 
              onClick={() => onAnswer(false)}
              className="flex-1 py-4 bg-red-100 border border-red-200 text-red-700 font-bold text-lg rounded-2xl shadow-sm hover:bg-red-200 active:scale-95 transition flex justify-center items-center gap-2"
            >
              <XCircle className="w-6 h-6" /> Salah
            </button>

            <button 
              onClick={() => onAnswer(true)}
              className="flex-[2] py-4 bg-emerald-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:bg-emerald-700 active:scale-95 transition hover:shadow-xl flex justify-center items-center gap-2 animate-bounce-short"
            >
              <CheckCircle className="w-6 h-6" /> Benar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Game;