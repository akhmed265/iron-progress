<template>
  <div class="diary-view">
    <h1 class="page-title">Дневник тренировок</h1>

    <div class="diary-filters">
      <select v-model="selectedPeriod" class="period-select">
        <option value="week">Неделя</option>
        <option value="month">Месяц</option>
        <option value="all">Все время</option>
      </select>
    </div>

    <div class="workouts-timeline">
      <div
        v-for="workout in filteredWorkouts"
        :key="workout.id"
        class="workout-entry"
      >
        <div class="workout-date">
          <div class="date-day">{{ formatDay(workout.date) }}</div>
          <div class="date-month">{{ formatMonth(workout.date) }}</div>
        </div>
        
        <div class="workout-content">
          <div class="workout-header">
            <h3 class="workout-title">
              Тренировка
              <span class="workout-type" v-if="workout.type">
                ({{ workout.type === 'strength' ? 'Силовая' : workout.type === 'cardio' ? 'Кардио' : 'Растяжка' }})
              </span>
            </h3>
            <span class="workout-status" :class="{ completed: workout.completed }">
              {{ workout.completed ? '✅ Завершено' : '⏳ Не завершено' }}
            </span>
          </div>

          <div class="workout-stats">
            <span class="stat-item">
              <strong>{{ workout.exercises.length }}</strong> упражнений
            </span>
            <span class="stat-item">
              Длительность: <strong>{{ workout.duration }}</strong> мин
            </span>
          </div>

          <div v-if="workout.notes" class="workout-notes">
            <h4>Заметки:</h4>
            <p>{{ workout.notes }}</p>
          </div>

          <div class="workout-exercises">
            <h4>Упражнения:</h4>
            <ul>
              <li v-for="(exercise, index) in workout.exercises" :key="index">
                {{ formatExercise(exercise) }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredWorkouts.length === 0" class="no-workouts">
      <p>Нет записей о тренировках</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import { useExerciseStore } from '@/stores/useExerciseStore';

dayjs.locale('ru');

const workoutStore = useWorkoutStore();
const exerciseStore = useExerciseStore();
const selectedPeriod = ref<'week' | 'month' | 'all'>('month');

const filteredWorkouts = computed(() => {
  let workouts = [...workoutStore.workouts].sort((a, b) => 
    dayjs(b.date).diff(dayjs(a.date))
  );

  if (selectedPeriod.value === 'week') {
    const weekStart = dayjs().startOf('week');
    workouts = workouts.filter(w => dayjs(w.date).isAfter(weekStart.subtract(1, 'day')));
  } else if (selectedPeriod.value === 'month') {
    const monthStart = dayjs().startOf('month');
    workouts = workouts.filter(w => dayjs(w.date).isAfter(monthStart.subtract(1, 'day')));
  }

  return workouts;
});

const formatDay = (date: string) => dayjs(date).format('D');
const formatMonth = (date: string) => dayjs(date).format('MMM');

const formatExercise = (exercise: any) => {
  const exerciseData = exerciseStore.getExerciseById(exercise.exerciseId);
  const name = exerciseData?.name || 'Неизвестное упражнение';
  
  if (exercise.weight) {
    return `${name}: ${exercise.sets} × ${exercise.reps} × ${exercise.weight}кг`;
  } else if (exercise.duration) {
    return `${name}: ${Math.floor(exercise.duration / 60)} мин`;
  } else {
    return `${name}: ${exercise.sets} × ${exercise.reps}`;
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.diary-view {
  width: 100%;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-xl;
}

.diary-filters {
  margin-bottom: $spacing-xl;
}

.period-select {
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  border: 2px solid $bg-tertiary;
  background: $bg-secondary;
  color: $text-primary;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: $accent-1;
  }
}

.workouts-timeline {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.workout-entry {
  display: flex;
  gap: $spacing-lg;
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-lg;
}

.workout-date {
  min-width: 80px;
  text-align: center;
  padding: $spacing-md;
  background: $bg-tertiary;
  border-radius: $radius-md;
}

.date-day {
  font-size: 2rem;
  font-weight: 700;
  color: $accent-1;
}

.date-month {
  font-size: 0.875rem;
  color: $text-secondary;
  text-transform: uppercase;
}

.workout-content {
  flex: 1;
}

.workout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.workout-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: $text-primary;
}

.workout-type {
  font-size: 0.875rem;
  font-weight: 400;
  color: $text-secondary;
}

.workout-status {
  font-size: 0.875rem;
  color: $text-secondary;

  &.completed {
    color: $accent-1;
  }
}

.workout-stats {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-md;
  color: $text-secondary;
}

.stat-item {
  strong {
    color: $text-primary;
  }
}

.workout-notes {
  margin-bottom: $spacing-md;
  padding: $spacing-md;
  background: $bg-tertiary;
  border-radius: $radius-md;

  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: $text-secondary;
    margin-bottom: $spacing-xs;
    text-transform: uppercase;
  }

  p {
    color: $text-primary;
  }
}

.workout-exercises {
  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
    text-transform: uppercase;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    color: $text-primary;
    padding: $spacing-xs 0;
    border-bottom: 1px solid $bg-tertiary;

    &:last-child {
      border-bottom: none;
    }
  }
}

.no-workouts {
  text-align: center;
  padding: $spacing-2xl;
  background: $bg-secondary;
  border-radius: $radius-lg;
  color: $text-secondary;
}

@media (max-width: $breakpoint-mobile) {
  .workout-entry {
    flex-direction: column;
  }

  .workout-date {
    align-self: flex-start;
  }

  .workout-stats {
    flex-direction: column;
    gap: $spacing-xs;
  }
}
</style>

