import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import Settings from './components/Settings';
import Game from './components/Game';
import Result from './components/Result';
import { ALL_QUESTIONS } from './constants';
import { GameState, GameSettings, Question } from './types';

const App = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Queue System State
  const [queue, setQueue] = useState<Question[]>([]);
  const [totalInitialQuestions, setTotalInitialQuestions] = useState(0);
  const [score, setScore] = useState(0);
  
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Settings State
  const [settings, setSettings] = useState<GameSettings>({
    useTimer: false,
    inputDuration: 5,
    numQuestions: 10,
  });
  const [timeLeft, setTimeLeft] = useState(0);

  // Function to play beep sound
  const playBeep = (freq = 440, type: OscillatorType = 'sine', duration = 0.5) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); 
      
      // Volume envelope
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  // Timer Effect
  useEffect(() => {
    let timerInterval: ReturnType<typeof setInterval>;
    if (gameState === 'playing' && settings.useTimer && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          // Trigger sound if time is running out (Last 15 seconds)
          if (prev <= 16 && prev > 1) { 
             playBeep(880, 'sine', 0.1); // High pitch beep
          }
          
          if (prev <= 1) {
            playBeep(440, 'triangle', 1); // Final sound
            clearInterval(timerInterval);
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [gameState, settings.useTimer, timeLeft]);

  // Format Time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const prepareGame = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setGameState('settings');
  };

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const startConfirm = () => {
    if (!selectedCategory) return;

    // Shuffle questions
    const catQuestions = [...ALL_QUESTIONS[selectedCategory]];
    for (let i = catQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [catQuestions[i], catQuestions[j]] = [catQuestions[j], catQuestions[i]];
    }
    
    // Slice based on selected number of questions
    const selectedQuestions = catQuestions.slice(0, settings.numQuestions);
    setQueue(selectedQuestions);
    setTotalInitialQuestions(selectedQuestions.length);
    setScore(0);
    setIsFlipped(false);
    
    // Timer setup
    if (settings.useTimer) {
      setTimeLeft(settings.inputDuration * 60);
    }
    
    setGameState('playing');
  };

  // Skip: Move current item to end of queue
  const handleSkip = () => {
    if (queue.length <= 1) return; // Can't skip if only 1 left
    
    const currentItem = queue[0];
    const newQueue = [...queue.slice(1), currentItem];
    
    setQueue(newQueue);
    setIsFlipped(false);
    playBeep(300, 'sine', 0.1); // Low beep for skip
  };

  // Answer: Correct or Incorrect
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      playBeep(600, 'sine', 0.2); // Happy beep
    } else {
      playBeep(200, 'sawtooth', 0.3); // Sad beep
    }

    const newQueue = queue.slice(1);
    
    if (newQueue.length === 0) {
      setGameState('finished');
    } else {
      setQueue(newQueue);
      setIsFlipped(false);
    }
  };

  const goHome = () => {
    setGameState('menu');
    setSelectedCategory(null);
    setSettings(prev => ({ ...prev, useTimer: false, numQuestions: 10 }));
    setIsFlipped(false);
  };

  const retryCategory = () => {
    if (selectedCategory) {
       prepareGame(selectedCategory);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col w-full relative">
      <Header 
        gameState={gameState} 
        timeLeft={timeLeft} 
        useTimer={settings.useTimer} 
        onGoHome={goHome} 
        formatTime={formatTime} 
      />

      <div className="flex-1 w-full flex flex-col overflow-y-auto">
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex-1 flex flex-col">
          {gameState === 'menu' && (
            <Menu onSelectCategory={prepareGame} />
          )}

          {gameState === 'settings' && (
            <Settings 
              categoryId={selectedCategory}
              settings={settings}
              onUpdateSettings={updateSettings}
              onStart={startConfirm}
            />
          )}

          {gameState === 'playing' && (
            <Game 
              currentQuestion={queue[0]}
              remainingCount={queue.length}
              totalInitial={totalInitialQuestions}
              categoryId={selectedCategory}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(true)}
              onSkip={handleSkip}
              onAnswer={handleAnswer}
            />
          )}

          {gameState === 'finished' && (
            <Result 
              categoryId={selectedCategory}
              score={score}
              totalQuestions={totalInitialQuestions}
              timeLeft={timeLeft}
              useTimer={settings.useTimer}
              onRetry={retryCategory}
              onGoHome={goHome}
            />
          )}
        </div>
      </div>
      
      <div className="w-full p-4 text-center text-xs text-gray-400 bg-gray-50 border-t">
        Dibuat untuk Pengajian Akhir Tahun 2025 - Desa Cikampek Barat
      </div>
    </div>
  );
};

export default App;