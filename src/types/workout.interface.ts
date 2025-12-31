import type { WorkoutExercise } from './exercise.interface';

export interface Workout {
  id: string;
  date: string;
  exercises: WorkoutExercise[];
  duration: number; // общая длительность в минутах
  completed: boolean;
  notes?: string;
  type?: 'strength' | 'cardio' | 'flexibility';
}

export interface WorkoutPlan {
  id: string;
  name: string;
  workouts: Workout[];
  startDate: string;
  endDate?: string;
}

