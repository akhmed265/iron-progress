import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import type { Goal, GoalType } from '@/types/goal.interface';
import { useLocalStorage } from '@/composables/useLocalStorage';
import { useWorkoutStore } from './useWorkoutStore';
import { useUserStore } from './useUserStore';

export const useGoalStore = defineStore('goal', () => {
  const storage = useLocalStorage<Goal[]>('iron-progress-goals', []);
  const goals = ref<Goal[]>(storage.read());

  const activeGoals = computed(() => {
    return goals.value.filter(g => !g.completed);
  });

  const completedGoals = computed(() => {
    return goals.value.filter(g => g.completed);
  });

  function addGoal(goal: Omit<Goal, 'id' | 'current' | 'completed' | 'createdAt'>) {
    const newGoal: Goal = {
      ...goal,
      id: `goal-${Date.now()}`,
      current: 0,
      completed: false,
      createdAt: dayjs().toISOString()
    };
    goals.value.push(newGoal);
    storage.write(goals.value);
    updateGoalProgress(newGoal.id);
    return newGoal;
  }

  function updateGoal(id: string, updates: Partial<Goal>) {
    const index = goals.value.findIndex(g => g.id === id);
    if (index !== -1) {
      goals.value[index] = { ...goals.value[index], ...updates };
      storage.write(goals.value);
      updateGoalProgress(id);
    }
  }

  function deleteGoal(id: string) {
    goals.value = goals.value.filter(g => g.id !== id);
    storage.write(goals.value);
  }

  function updateGoalProgress(goalId?: string) {
    const workoutStore = useWorkoutStore();
    const userStore = useUserStore();
    
    const goalsToUpdate = goalId 
      ? goals.value.filter(g => g.id === goalId)
      : goals.value;

    goalsToUpdate.forEach(goal => {
      let current = 0;
      const now = dayjs();

      switch (goal.type) {
        case 'workouts_per_month': {
          const monthStart = now.startOf('month');
          const completed = workoutStore.completedWorkouts.filter(w => {
            const workoutDate = dayjs(w.date);
            return workoutDate.isAfter(monthStart.subtract(1, 'day')) && 
                   workoutDate.isBefore(monthStart.add(1, 'month'));
          });
          current = completed.length;
          break;
        }
        case 'workouts_per_week': {
          const weekStart = now.startOf('week');
          const completed = workoutStore.completedWorkouts.filter(w => {
            const workoutDate = dayjs(w.date);
            return workoutDate.isAfter(weekStart.subtract(1, 'day')) && 
                   workoutDate.isBefore(weekStart.add(1, 'week'));
          });
          current = completed.length;
          break;
        }
        case 'volume_per_month': {
          const monthStart = now.startOf('month');
          const completed = workoutStore.completedWorkouts.filter(w => {
            const workoutDate = dayjs(w.date);
            return workoutDate.isAfter(monthStart.subtract(1, 'day')) && 
                   workoutDate.isBefore(monthStart.add(1, 'month'));
          });
          current = completed.reduce((sum, workout) => {
            return sum + workout.exercises.reduce((exerciseSum, ex) => {
              return exerciseSum + (ex.weight || 0) * ex.reps * ex.sets;
            }, 0);
          }, 0);
          break;
        }
        case 'streak_days': {
          current = userStore.stats.streakDays;
          break;
        }
      }

      const completed = current >= goal.target;
      updateGoal(goal.id, { current, completed });
    });
  }

  function loadGoals() {
    goals.value = storage.read();
    updateGoalProgress();
  }

  return {
    goals,
    activeGoals,
    completedGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
    loadGoals
  };
});

