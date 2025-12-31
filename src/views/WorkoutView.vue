<template>
  <div class="workout-view">
    <div class="workout-header">
      <BaseButton variant="ghost" @click="$router.back()">← Назад</BaseButton>
      <h1 class="page-title">
        <img :src="calendarWeekIcon" alt="План тренировки" class="title-icon" />
        План тренировки
      </h1>
      <div></div>
    </div>

    <div v-if="workout" class="workout-content">
      <div class="workout-info-card">
        <h2 class="workout-name">
          Тренировка
          <span v-if="workout.type" class="workout-type-label">
            ({{ workoutTypeLabel }})
          </span>
        </h2>
        <div class="workout-meta">
          <span>{{ workout.exercises.length }} упражнений</span>
          <span>•</span>
          <span>{{ workout.duration }} мин</span>
        </div>
      </div>

      <div class="exercises-list">
        <div
          v-for="(exerciseItem, index) in workout.exercises"
          :key="index"
          class="exercise-card"
          :class="{ completed: exerciseItem.completed }"
        >
          <div class="exercise-header">
            <h3 class="exercise-name">
              {{ getExerciseName(exerciseItem.exerciseId) }}
            </h3>
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="exerciseItem.completed"
                @change="toggleExercise(index, $event)"
              />
              <span class="checkmark"></span>
            </label>
          </div>

          <div class="exercise-details">
            <div class="detail-item">
              <span class="detail-label">Подходы:</span>
              <span class="detail-value">{{ exerciseItem.sets }}</span>
            </div>
            
            <div v-if="exerciseItem.weight !== undefined" class="detail-item">
              <span class="detail-label">Вес:</span>
              <span class="detail-value">{{ exerciseItem.weight }} кг</span>
            </div>

            <div v-if="exerciseItem.reps" class="detail-item">
              <span class="detail-label">Повторения:</span>
              <span class="detail-value">{{ exerciseItem.reps }}</span>
            </div>

            <div v-if="exerciseItem.duration" class="detail-item">
              <span class="detail-label">Длительность:</span>
              <span class="detail-value">{{ formatDuration(exerciseItem.duration) }}</span>
            </div>
          </div>

          <!-- Таймер для кардио упражнений -->
          <div
            v-if="isCardioExercise(exerciseItem) && !exerciseItem.completed"
            class="exercise-timer"
          >
            <WorkoutTimer
              :initial-seconds="exerciseItem.duration || 60"
              @finished="() => completeExercise(index)"
            />
          </div>
        </div>
      </div>

      <div class="workout-actions">
        <BaseButton
          variant="primary"
          size="large"
          @click="completeWorkout"
          :disabled="!allExercisesCompleted"
        >
          Завершить тренировку
        </BaseButton>
      </div>
    </div>

    <div v-else class="not-found">
      <p>Тренировка не найдена</p>
      <BaseButton variant="primary" @click="$router.push('/')">
        На главную
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import { useExerciseStore } from '@/stores/useExerciseStore';
import { useToast } from '@/composables/useToast';
import BaseButton from '@/components/shared/BaseButton.vue';
import WorkoutTimer from '@/components/ui/WorkoutTimer.vue';
import calendarWeekIcon from '@/assets/icons/calendar_week-white.svg';
import type { WorkoutExercise } from '@/types/workout.interface';

const route = useRoute();
const router = useRouter();
const workoutStore = useWorkoutStore();
const exerciseStore = useExerciseStore();
const toast = useToast();

const workoutId = route.params.id as string;
const workout = computed(() => workoutStore.getWorkoutById(workoutId));

const workoutTypeLabel = computed(() => {
  if (!workout.value?.type) return '';
  const types: Record<string, string> = {
    strength: 'Силовая',
    cardio: 'Кардио',
    flexibility: 'Растяжка'
  };
  return types[workout.value.type] || '';
});

const allExercisesCompleted = computed(() => {
  return workout.value?.exercises.every(ex => ex.completed) ?? false;
});

const getExerciseName = (exerciseId: string): string => {
  const exercise = exerciseStore.getExerciseById(exerciseId);
  return exercise?.name || 'Неизвестное упражнение';
};

const isCardioExercise = (exercise: WorkoutExercise): boolean => {
  // Таймер показываем для упражнений с длительностью (кардио, планка и т.п.)
  return exercise.duration !== undefined && exercise.duration > 0;
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}м ${secs}с` : `${mins}м`;
};

const toggleExercise = (index: number, event: Event) => {
  if (!workout.value) return;
  
  const checked = (event.target as HTMLInputElement).checked;
  const exercises = [...workout.value.exercises];
  exercises[index] = { ...exercises[index], completed: checked };
  
  workoutStore.updateWorkout(workout.value.id, { exercises });
};

const completeExercise = (index: number) => {
  if (!workout.value) return;
  
  const exercises = [...workout.value.exercises];
  exercises[index] = { ...exercises[index], completed: true };
  
  workoutStore.updateWorkout(workout.value.id, { exercises });
};

const completeWorkout = () => {
  if (workout.value) {
    workoutStore.completeWorkout(workout.value.id);
    toast.success('🎉 Тренировка завершена! Вы отлично поработали!', 4000);
    router.push('/');
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.workout-view {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.workout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-xl;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: $text-primary;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.title-icon {
  width: 32px;
  height: 32px;
}

.workout-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.workout-info-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-lg;
}

.workout-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.workout-type-label {
  font-size: 1rem;
  font-weight: 400;
  color: $text-secondary;
}

.workout-meta {
  display: flex;
  gap: $spacing-sm;
  color: $text-secondary;
  font-size: 0.875rem;
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.exercise-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  border: 2px solid transparent;
  transition: all $transition-base;

  &.completed {
    border-color: $accent-1;
    background: rgba(0, 200, 150, 0.05);
  }
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.exercise-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: $text-primary;
}

.checkbox-label {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.checkbox-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
}

.checkmark {
  width: 24px;
  height: 24px;
  border: 2px solid $text-secondary;
  border-radius: $radius-sm;
  background: transparent;
  transition: all $transition-base;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    display: none;
    left: 7px;
    top: 3px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
}

.checkbox-label input:checked ~ .checkmark {
  background: $accent-1;
  border-color: $accent-1;
}

.checkbox-label input:checked ~ .checkmark::after {
  display: block;
}

.exercise-details {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
}

.detail-item {
  display: flex;
  gap: $spacing-xs;
  color: $text-secondary;
}

.detail-label {
  font-size: 0.875rem;
}

.detail-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: $text-primary;
}

.exercise-timer {
  margin-top: $spacing-md;
  padding-top: $spacing-md;
  border-top: 1px solid $bg-tertiary;
}

.workout-actions {
  margin-top: $spacing-xl;
  display: flex;
  justify-content: center;
}

.not-found {
  text-align: center;
  padding: $spacing-2xl;
  color: $text-secondary;
}

@media (max-width: $breakpoint-mobile) {
  .workout-header {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-md;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>

