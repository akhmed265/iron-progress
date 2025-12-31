export type MuscleGroup = 'chest' | 'back' | 'legs' | 'arms' | 'shoulders' | 'core';
export type Equipment = 'barbell' | 'dumbbell' | 'machine' | 'bodyweight' | 'kettlebell';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup[];
  equipment: Equipment[];
  difficulty: Difficulty;
  description: string;
  imageUrl?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // для кардио в секундах
  restTime?: number; // отдых между подходами в секундах
  completed?: boolean;
}

