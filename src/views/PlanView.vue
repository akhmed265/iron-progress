<template>
  <div class="plan-view">
    <div class="plan-header">
      <h1 class="page-title">Мой план</h1>
      <BaseButton variant="primary" @click="handleAddWorkout">
        + Добавить тренировку
      </BaseButton>
    </div>

    <CalendarGrid @day-click="handleDayClick" />

    <div v-if="selectedDateWorkouts.length > 0" class="workouts-list">
      <h2 class="section-title">Тренировки на {{ formatDate(selectedDate) }}</h2>
      <div
        v-for="workout in selectedDateWorkouts"
        :key="workout.id"
        class="workout-item"
      >
        <div class="workout-header">
          <h3>{{ workout.type || 'Тренировка' }}</h3>
          <span class="workout-status" :class="{ completed: workout.completed }">
            {{ workout.completed ? '✅ Завершено' : '⏳ Запланировано' }}
          </span>
        </div>
        <p class="workout-exercises">{{ workout.exercises.length }} упражнений</p>
        <p v-if="workout.notes" class="workout-notes">{{ workout.notes }}</p>
        <div class="workout-actions">
          <BaseButton variant="outline" size="small" @click="editWorkout(workout)">
            Редактировать
          </BaseButton>
          <BaseButton 
            v-if="!workout.completed"
            variant="primary" 
            size="small"
            @click="completeWorkout(workout.id)"
          >
            Завершить
          </BaseButton>
        </div>
      </div>
    </div>

    <div v-else-if="selectedDate" class="no-workouts">
      <p>На эту дату нет запланированных тренировок</p>
      <BaseButton variant="primary" @click="handleAddWorkout">
        Добавить тренировку
      </BaseButton>
    </div>

    <!-- Модальное окно создания/редактирования тренировки -->
    <WorkoutModal
      :is-open="showModal"
      :workout="selectedWorkout"
      :initial-date="selectedDate"
      @close="handleCloseModal"
      @save="handleSaveWorkout"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import type { Workout } from '@/types/workout.interface';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import { useGoalStore } from '@/stores/useGoalStore';
import { useToast } from '@/composables/useToast';
import CalendarGrid from '@/components/ui/CalendarGrid.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import WorkoutModal from '@/components/ui/WorkoutModal.vue';

const workoutStore = useWorkoutStore();
const goalStore = useGoalStore();
const toast = useToast();
const selectedDate = ref<string>(dayjs().format('YYYY-MM-DD'));
const showModal = ref(false);
const selectedWorkout = ref<Workout | undefined>(undefined);

const selectedDateWorkouts = computed(() => {
  return workoutStore.getWorkoutsByDate(selectedDate.value);
});

const handleDayClick = (date: string) => {
  selectedDate.value = date;
};

const formatDate = (date: string) => {
  return dayjs(date).format('D MMMM YYYY');
};

const completeWorkout = (id: string) => {
  workoutStore.completeWorkout(id);
  // Обновляем прогресс целей
  goalStore.updateGoalProgress();
  toast.success('🎉 Тренировка завершена! Отличная работа!', 4000);
};

const handleAddWorkout = () => {
  selectedWorkout.value = undefined;
  showModal.value = true;
};

const editWorkout = (workout: Workout) => {
  selectedWorkout.value = workout;
  showModal.value = true;
};

const handleCloseModal = () => {
  showModal.value = false;
  selectedWorkout.value = undefined;
};

const handleSaveWorkout = (workoutData: Omit<Workout, 'id' | 'completed'>) => {
  if (selectedWorkout.value) {
    // Редактирование существующей тренировки
    workoutStore.updateWorkout(selectedWorkout.value.id, workoutData);
    toast.success('Тренировка обновлена', 3000);
  } else {
    // Создание новой тренировки
    workoutStore.addWorkout({
      ...workoutData,
      completed: false
    });
    toast.success('✅ Тренировка добавлена в план!', 3000);
  }
  handleCloseModal();
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.plan-view {
  width: 100%;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-xl;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: $text-primary;
}

.workouts-list {
  margin-top: $spacing-xl;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.workout-item {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
}

.workout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.workout-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: $text-primary;
}

.workout-status {
  font-size: 0.875rem;
  color: $text-secondary;

  &.completed {
    color: $accent-1;
  }
}

.workout-exercises {
  color: $text-secondary;
  margin-bottom: $spacing-sm;
}

.workout-notes {
  color: $text-secondary;
  font-style: italic;
  margin-bottom: $spacing-md;
}

.workout-actions {
  display: flex;
  gap: $spacing-sm;
}

.no-workouts {
  margin-top: $spacing-xl;
  text-align: center;
  padding: $spacing-2xl;
  background: $bg-secondary;
  border-radius: $radius-lg;
  color: $text-secondary;
}
</style>

