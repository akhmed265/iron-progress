<template>
  <div class="dashboard-view">
    <h1 class="page-title">Добро пожаловать, {{ userStore.user.name }}!</h1>
    
    <!-- Виджет ближайшей запланированной тренировки -->
    <TodayWorkoutWidget v-if="nearestWorkout" :workout="nearestWorkout" />
    
    <div class="dashboard-grid">
      <div class="dashboard-card stats-card">
        <h2 class="card-title">Статистика</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ userStore.stats.totalWorkouts }}</div>
            <div class="stat-label">Тренировок</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ Math.round(userStore.stats.totalVolume) }} кг</div>
            <div class="stat-label">Общий объем</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userStore.stats.streakDays }}</div>
            <div class="stat-label">Дней подряд</div>
          </div>
        </div>
      </div>

      <div class="dashboard-card progress-card">
        <h2 class="card-title">Прогресс за неделю</h2>
        <ProgressCircle 
          :percentage="weekProgress" 
          :size="150"
          label="Завершено"
        />
      </div>
    </div>

    <!-- График прогресса -->
    <div class="dashboard-section">
      <div class="dashboard-card chart-card">
        <ProgressChart :data="chartData" :period="chartPeriod" @update:period="chartPeriod = $event" />
      </div>
    </div>

    <!-- Прогресс по группам мышц -->
    <div class="dashboard-section">
      <div class="dashboard-card muscle-card">
        <MuscleGroupProgress :muscle-group-data="muscleGroupData" />
      </div>
    </div>

    <!-- Цели -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">Мои цели</h2>
        <BaseButton variant="outline" size="small" @click="showGoalModal = true">
          + Добавить цель
        </BaseButton>
      </div>
      <div v-if="activeGoals.length > 0" class="goals-grid">
        <GoalCard
          v-for="goal in activeGoals"
          :key="goal.id"
          :goal="goal"
          @delete="deleteGoal(goal.id)"
        />
      </div>
      <div v-else class="no-goals">
        <p>У вас пока нет активных целей</p>
        <BaseButton variant="primary" @click="showGoalModal = true">
          Создать первую цель
        </BaseButton>
      </div>
    </div>

    <!-- Достижения -->
    <div class="dashboard-section">
      <h2 class="section-title">Достижения</h2>
      <div class="achievements-grid">
        <AchievementCard
          v-for="(achievement, index) in achievements"
          :key="index"
          :icon="achievement.icon"
          :title="achievement.title"
          :description="achievement.description"
          :unlocked="achievement.unlocked"
          :progress="achievement.progress"
          :target="achievement.target"
        />
      </div>
    </div>

    <!-- Модальное окно создания цели -->
    <GoalModal
      :is-open="showGoalModal"
      @close="showGoalModal = false"
      @save="handleSaveGoal"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { useUserStore } from '@/stores/useUserStore';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import { useExerciseStore } from '@/stores/useExerciseStore';
import { useToast } from '@/composables/useToast';
import ProgressCircle from '@/components/ui/ProgressCircle.vue';
import TodayWorkoutWidget from '@/components/ui/TodayWorkoutWidget.vue';
import ProgressChart from '@/components/ui/ProgressChart.vue';
import AchievementCard from '@/components/ui/AchievementCard.vue';
import MuscleGroupProgress from '@/components/ui/MuscleGroupProgress.vue';
import GoalCard from '@/components/ui/GoalCard.vue';
import GoalModal from '@/components/ui/GoalModal.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import { useGoalStore } from '@/stores/useGoalStore';
import type { MuscleGroup } from '@/types/exercise.interface';
import type { Goal } from '@/types/goal.interface';

const userStore = useUserStore();
const workoutStore = useWorkoutStore();
const exerciseStore = useExerciseStore();
const goalStore = useGoalStore();
const toast = useToast();

const showGoalModal = ref(false);
const activeGoals = computed(() => goalStore.activeGoals);

// Отслеживание предыдущего состояния достижений для показа toast
const previousAchievementsState = ref<Record<number, boolean>>({});

const nearestWorkout = computed(() => workoutStore.nearestWorkout);

const weekWorkouts = computed(() => workoutStore.weekWorkouts);
const completedWorkouts = computed(() => workoutStore.completedWorkouts);

const weekProgress = computed(() => {
  const total = weekWorkouts.value.length;
  if (total === 0) return 0;
  const completed = weekWorkouts.value.filter(w => w.completed).length;
  return (completed / total) * 100;
});

// Данные для графика за неделю
const weekChartData = computed(() => {
  const data = [0, 0, 0, 0, 0, 0, 0]; // 7 дней
  const startOfWeek = dayjs().startOf('week');
  
  completedWorkouts.value.forEach(workout => {
    const workoutDate = dayjs(workout.date);
    if (workoutDate.isAfter(startOfWeek.subtract(1, 'day')) && workoutDate.isBefore(startOfWeek.add(7, 'day'))) {
      const dayIndex = workoutDate.diff(startOfWeek, 'day');
      if (dayIndex >= 0 && dayIndex < 7) {
        data[dayIndex]++;
      }
    }
  });
  
  return data;
});

// Данные для графика за месяц
const monthChartData = computed(() => {
  const weeks = [0, 0, 0, 0]; // 4 недели
  const startOfMonth = dayjs().startOf('month');
  
  completedWorkouts.value.forEach(workout => {
    const workoutDate = dayjs(workout.date);
    if (workoutDate.isAfter(startOfMonth.subtract(1, 'day')) && workoutDate.isBefore(startOfMonth.add(1, 'month'))) {
      const weekIndex = Math.floor(workoutDate.diff(startOfMonth, 'day') / 7);
      if (weekIndex >= 0 && weekIndex < 4) {
        weeks[weekIndex]++;
      }
    }
  });
  
  return weeks;
});

const chartPeriod = ref<'week' | 'month'>('week');
const chartData = computed(() => chartPeriod.value === 'week' ? weekChartData.value : monthChartData.value);

// Данные для групп мышц
const muscleGroupData = computed<Record<MuscleGroup, number>>(() => {
  const groups: Record<MuscleGroup, number> = {
    chest: 0,
    back: 0,
    legs: 0,
    arms: 0,
    shoulders: 0,
    core: 0
  };
  
  completedWorkouts.value.forEach(workout => {
    workout.exercises.forEach(exerciseItem => {
      const exercise = exerciseStore.getExerciseById(exerciseItem.exerciseId);
      if (exercise) {
        exercise.muscleGroup.forEach(group => {
          groups[group] = (groups[group] || 0) + 1;
        });
      }
    });
  });
  
  return groups;
});

// Достижения
const achievements = computed(() => {
  const totalWorkouts = completedWorkouts.value.length;
  const streakDays = userStore.stats.streakDays;
  
  return [
    {
      icon: '🎯',
      title: 'Первая тренировка',
      description: 'Завершите свою первую тренировку',
      unlocked: totalWorkouts >= 1,
      progress: totalWorkouts,
      target: 1
    },
    {
      icon: '🔥',
      title: 'Страстный старт',
      description: 'Завершите 10 тренировок',
      unlocked: totalWorkouts >= 10,
      progress: totalWorkouts,
      target: 10
    },
    {
      icon: '💪',
      title: 'Сила духа',
      description: 'Завершите 50 тренировок',
      unlocked: totalWorkouts >= 50,
      progress: totalWorkouts,
      target: 50
    },
    {
      icon: '🏆',
      title: 'Мастер',
      description: 'Завершите 100 тренировок',
      unlocked: totalWorkouts >= 100,
      progress: totalWorkouts,
      target: 100
    },
    {
      icon: '🔥',
      title: 'Неделя подряд',
      description: 'Тренируйтесь 7 дней подряд',
      unlocked: streakDays >= 7,
      progress: streakDays,
      target: 7
    },
    {
      icon: '⭐',
      title: 'Месяц дисциплины',
      description: 'Тренируйтесь 30 дней подряд',
      unlocked: streakDays >= 30,
      progress: streakDays,
      target: 30
    }
  ];
});

// Отслеживание разблокировки достижений
watch(achievements, (newAchievements, oldAchievements) => {
  if (oldAchievements && oldAchievements.length > 0) {
    newAchievements.forEach((achievement, index) => {
      const wasUnlocked = previousAchievementsState.value[index] || false;
      const isUnlocked = achievement.unlocked;
      
      if (!wasUnlocked && isUnlocked) {
        // Достижение только что разблокировано
        toast.success(`${achievement.icon} ${achievement.title}`, 5000, achievement.icon);
      }
      
      previousAchievementsState.value[index] = isUnlocked;
    });
  } else {
    // Первая инициализация - сохраняем текущее состояние
    newAchievements.forEach((achievement, index) => {
      previousAchievementsState.value[index] = achievement.unlocked;
    });
  }
}, { immediate: true });

// Обработчики для целей
const handleSaveGoal = (goalData: Omit<Goal, 'id' | 'current' | 'completed' | 'createdAt'>) => {
  goalStore.addGoal(goalData);
  toast.success('🎯 Цель создана!', 3000);
};

const deleteGoal = (id: string) => {
  goalStore.deleteGoal(id);
  toast.info('Цель удалена', 2000);
};

// Обновление прогресса целей при изменении тренировок
watch(completedWorkouts, () => {
  goalStore.updateGoalProgress();
}, { deep: true });

</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.dashboard-view {
  width: 100%;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-xl;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-lg;
}

.dashboard-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-xl;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-md;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: $accent-1;
  margin-bottom: $spacing-xs;
}

.stat-label {
  font-size: 0.875rem;
  color: $text-secondary;
}

.progress-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.today-workout {
  text-align: center;
}

.workout-info {
  color: $text-secondary;
  margin-bottom: $spacing-md;
}

.completed-badge {
  color: $accent-1;
  font-weight: 600;
  font-size: 1.125rem;
}

.no-workout {
  color: $text-secondary;
  text-align: center;
}

.dashboard-section {
  margin-top: $spacing-xl;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-md;
}

.no-goals {
  text-align: center;
  padding: $spacing-2xl;
  background: $bg-secondary;
  border-radius: $radius-lg;
  color: $text-secondary;
}

.chart-card {
  padding: 0;
  overflow: hidden;
}

.muscle-card {
  padding: $spacing-xl;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-md;
}

@media (max-width: $breakpoint-mobile) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }
}
</style>

