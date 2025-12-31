import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import type { Workout, WorkoutPlan } from '@/types/workout.interface';
import { useLocalStorage } from '@/composables/useLocalStorage';
import { useUserStore } from './useUserStore';

export const useWorkoutStore = defineStore('workout', () => {
  const storage = useLocalStorage<Workout[]>('iron-progress-workouts', []);
  const plansStorage = useLocalStorage<WorkoutPlan[]>('iron-progress-plans', []);
  
  const workouts = ref<Workout[]>(storage.read());
  const plans = ref<WorkoutPlan[]>(plansStorage.read());

  const todayWorkout = computed(() => {
    const today = dayjs().format('YYYY-MM-DD');
    return workouts.value.find(w => w.date === today);
  });

  const nearestWorkout = computed(() => {
    const today = dayjs().format('YYYY-MM-DD');
    // Находим все незавершенные тренировки с датой >= сегодня
    const upcomingWorkouts = workouts.value
      .filter(w => !w.completed && w.date >= today)
      .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
    
    return upcomingWorkouts.length > 0 ? upcomingWorkouts[0] : undefined;
  });

  const completedWorkouts = computed(() => {
    return workouts.value.filter(w => w.completed);
  });

  const weekWorkouts = computed(() => {
    const startOfWeek = dayjs().startOf('week');
    const endOfWeek = dayjs().endOf('week');
    
    return workouts.value.filter(w => {
      const workoutDate = dayjs(w.date);
      return workoutDate.isAfter(startOfWeek.subtract(1, 'day')) && 
             workoutDate.isBefore(endOfWeek.add(1, 'day'));
    });
  });

  function addWorkout(workout: Omit<Workout, 'id'>) {
    const newWorkout: Workout = {
      ...workout,
      id: `workout-${Date.now()}`
    };
    workouts.value.push(newWorkout);
    storage.write(workouts.value);
    updateStats();
    return newWorkout;
  }

  function updateWorkout(id: string, updates: Partial<Workout>) {
    const index = workouts.value.findIndex(w => w.id === id);
    if (index !== -1) {
      workouts.value[index] = { ...workouts.value[index], ...updates };
      storage.write(workouts.value);
      updateStats();
    }
  }

  function deleteWorkout(id: string) {
    workouts.value = workouts.value.filter(w => w.id !== id);
    storage.write(workouts.value);
    updateStats();
  }

  function getWorkoutById(id: string): Workout | undefined {
    return workouts.value.find(w => w.id === id);
  }

  function getWorkoutsByDate(date: string): Workout[] {
    return workouts.value.filter(w => w.date === date);
  }

  function completeWorkout(id: string) {
    updateWorkout(id, { completed: true });
  }

  function updateStats() {
    const userStore = useUserStore();
    const completed = completedWorkouts.value;
    
    const totalVolume = completed.reduce((sum, workout) => {
      return sum + workout.exercises.reduce((exerciseSum, ex) => {
        return exerciseSum + (ex.weight || 0) * ex.reps * ex.sets;
      }, 0);
    }, 0);

    userStore.updateStats({
      totalWorkouts: completed.length,
      totalVolume
    });
  }

  function loadUserData() {
    workouts.value = storage.read();
    plans.value = plansStorage.read();
    updateStats();
  }

  function exportData() {
    return {
      workouts: workouts.value,
      plans: plans.value,
      exportDate: dayjs().toISOString()
    };
  }

  function importData(data: { workouts?: Workout[]; plans?: WorkoutPlan[] }) {
    if (data.workouts) {
      workouts.value = data.workouts;
      storage.write(workouts.value);
    }
    if (data.plans) {
      plans.value = data.plans;
      plansStorage.write(plans.value);
    }
    updateStats();
  }

  return {
    workouts,
    plans,
    todayWorkout,
    nearestWorkout,
    completedWorkouts,
    weekWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkoutById,
    getWorkoutsByDate,
    completeWorkout,
    loadUserData,
    exportData,
    importData
  };
});

