import React from 'react';
import { Settings as SettingsIcon, ListFilter, Clock, Play } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { GameSettings } from '../types';

interface SettingsProps {
  categoryId: string | null;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onStart: () => void;
}

const Settings: React.FC<SettingsProps> = ({ categoryId, settings, onUpdateSettings, onStart }) => {
  const categoryName = CATEGORIES.find(c => c.id === categoryId)?.name;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
      <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-8 text-emerald-600 border-b pb-4">
          <SettingsIcon className="w-7 h-7" />
          <h2 className="text-2xl font-bold">Pengaturan Kuis</h2>
        </div>
        
        <div className="mb-8 space-y-5">
          <div className="text-center mb-6">
            <span className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Kategori Terpilih</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{categoryName}</p>
          </div>
          
          {/* Select Number of Questions */}
          <div className="p-5 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <ListFilter className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-bold">Jumlah Soal</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => onUpdateSettings({ numQuestions: 10 })}
                className={`flex-1 py-3 rounded-xl font-bold transition shadow-sm ${settings.numQuestions === 10 ? 'bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-2' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
              >
                10 Soal
              </button>
              <button 
                onClick={() => onUpdateSettings({ numQuestions: 20 })}
                  className={`flex-1 py-3 rounded-xl font-bold transition shadow-sm ${settings.numQuestions === 20 ? 'bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-2' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
              >
                20 Soal
              </button>
            </div>
          </div>

          {/* Timer Toggle */}
          <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-bold">Pakai Timer?</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.useTimer} 
                onChange={(e) => onUpdateSettings({ useTimer: e.target.checked })} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {settings.useTimer && (
            <div className="animate-fade-in p-5 bg-emerald-50 rounded-xl border border-emerald-100">
              <label className="block text-sm font-bold text-emerald-800 mb-3">
                Durasi Waktu (Menit):
              </label>
              <div className="flex items-center gap-3">
                  <input 
                  type="number" 
                  min="1" 
                  max="60"
                  value={settings.inputDuration}
                  onChange={(e) => onUpdateSettings({ inputDuration: parseInt(e.target.value) || 1 })}
                  className="w-full p-3 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-center font-bold text-xl bg-white"
                />
                <span className="text-emerald-700 font-bold">Menit</span>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={onStart}
          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-95 transition flex items-center justify-center gap-2 text-lg"
        >
          <Play className="w-6 h-6 fill-current" /> Mulai Kuis
        </button>
      </div>
    </div>
  );
};

export default Settings;