import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface MenuProps {
  onSelectCategory: (id: string) => void;
}

const Menu: React.FC<MenuProps> = ({ onSelectCategory }) => {
  return (
    <div className="animate-fade-in w-full">
      <div className="text-center mb-8 mt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Pilih Topik Kuis</h2>
        <p className="text-gray-500">Ketuk kartu untuk memulai kuis flashcard.</p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`${cat.color} text-white p-6 rounded-2xl shadow-lg hover:brightness-110 active:scale-95 hover:shadow-xl transition-all flex flex-col gap-4 group h-full justify-between border-2 border-transparent hover:border-white/20`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="p-3 bg-white/20 rounded-xl">
                {cat.icon}
              </div>
              <ChevronRight className="w-6 h-6 opacity-70 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-left mt-2">
              <h3 className="font-bold text-xl mb-1">{cat.name}</h3>
              <p className="text-sm opacity-90">Atur Jumlah Soal</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Menu;