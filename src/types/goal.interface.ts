export interface Goal {
  id: string;
  type: 'workouts_per_month' | 'workouts_per_week' | 'volume_per_month' | 'streak_days';
  target: number;
  current: number;
  period: 'month' | 'week' | 'all';
  createdAt: string;
  deadline?: string;
  completed: boolean;
}

export type GoalType = Goal['type'];

