export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  weight?: number;
  height?: number;
  goals?: string[];
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  units: 'metric' | 'imperial';
  notifications: boolean;
  soundEnabled: boolean;
  nutritionGoal?: 'gain' | 'lose' | 'maintain';
  targetCalories?: number;
}

export interface UserStats {
  totalWorkouts: number;
  totalVolume: number; // общий объем в кг
  personalRecords: Record<string, number>;
  streakDays: number;
  lastWorkoutDate?: string;
}

