import { ReactNode } from 'react';

export interface Question {
  q: string;
  a: string;
}

export interface Category {
  id: string;
  name: string;
  icon: ReactNode;
  color: string;
}

export type GameState = 'menu' | 'settings' | 'playing' | 'finished';

export interface GameSettings {
  useTimer: boolean;
  inputDuration: number;
  numQuestions: number;
}