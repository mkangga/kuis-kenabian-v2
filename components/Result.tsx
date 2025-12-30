import React from 'react';
import { Star, Clock, Trophy, Target } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface ResultProps {
  categoryId: string | null;
  score: number;
  totalQuestions: number;
  timeLeft: number;
  useTimer: boolean;
  onRetry: () => void;
  onGoHome: () => void;
}

const Result: React.FC<ResultProps> = ({ 
  categoryId, 
  score, 
  totalQuestions, 
  timeLeft, 
  useTimer, 
  onRetry, 
  onGoHome 
}) => {
  const categoryName = CATEGORIES.find(c => c.id === categoryId)?.name;
  const isTimeOut = useTimer && timeLeft === 0;
  
  // Calculate percentage
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in max-w-md mx-auto">
      {isTimeOut ? (
          <div className="w-28 h-28 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Clock className="w-14 h-14 text-red-500" />
        </div>
      ) : (
        <div className="w-28 h-28 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-14 h-14 text-yellow-600 fill-current" />
        </div>
      )}

      <h2 className="text-3xl font-bold text-gray-800 mb-2 px-4">
        {isTimeOut ? "Waktu Habis!" : "Sesi Selesai!"}
      </h2>
      <p className="text-gray-500 mb-8">{categoryName}</p>
      
      {/* Score Card */}
      <div className="w-full bg-white border border-gray-100 p-6 rounded-2xl shadow-lg mb-8 flex flex-col gap-2">
        <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Skor Anda</span>
        <div className="flex items-end justify-center gap-2 text-emerald-600">
           <span className="text-6xl font-black">{score}</span>
           <span className="text-2xl font-bold text-gray-400 mb-2">/ {totalQuestions}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
          <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${percentage}%`}}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          {percentage === 100 ? "Sempurna! Masya Allah Tabarakallah." : percentage > 70 ? "Hasil yang sangat bagus!" : "Terus semangat belajar!"}
        </p>
      </div>
      
      <button 
        onClick={onRetry}
        className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-95 transition mb-4 text-lg"
      >
        Ulangi Kategori Ini
      </button>
      <button 
        onClick={onGoHome}
        className="w-full py-4 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition text-lg"
      >
        Pilih Kategori Lain
      </button>
    </div>
  );
};

export default Result;