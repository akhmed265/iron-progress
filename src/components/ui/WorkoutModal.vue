<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditing ? 'Редактировать тренировку' : 'Создать тренировку' }}</h2>
          <button class="modal-close" @click="handleClose">×</button>
        </div>

        <div class="modal-content">
          <div class="form-group">
            <label class="form-label">Дата тренировки</label>
            <input
              v-model="formData.date"
              type="date"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Тип тренировки</label>
            <select v-model="formData.type" class="form-select">
              <option value="strength">Силовая</option>
              <option value="cardio">Кардио</option>
              <option value="flexibility">Растяжка</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Длительность (минуты)</label>
            <input
              v-model.number="formData.duration"
              type="number"
              min="1"
              class="form-input"
              required
            />
          </div>

          <div class="exercises-section">
            <div class="section-header">
              <h3 class="section-title">Упражнения</h3>
              <BaseButton variant="outline" size="small" @click="showExercisePicker = true">
                + Добавить упражнение
              </BaseButton>
            </div>

            <div v-if="formData.exercises.length === 0" class="empty-state">
              <p>Нет добавленных упражнений</p>
            </div>

            <div v-else class="exercises-list">
              <div
                v-for="(exerciseItem, index) in formData.exercises"
                :key="index"
                class="exercise-item"
                :draggable="true"
                @dragstart="handleDragStart(index, $event)"
                @dragover.prevent="handleDragOver($event)"
                @drop="handleDrop(index, $event)"
                @dragend="handleDragEnd"
                :class="{ 'dragging': draggedIndex === index }"
              >
                <div class="drag-handle">☰</div>
                <div class="exercise-info">
                  <h4 class="exercise-name">
                    {{ getExerciseName(exerciseItem.exerciseId) }}
                  </h4>
                  <div class="exercise-sets">
                    <div class="set-input-group">
                      <label>Подходы</label>
                      <input
                        v-model.number="exerciseItem.sets"
                        type="number"
                        min="1"
                        class="set-input"
                      />
                    </div>
                    <div class="set-input-group">
                      <label>Повторения</label>
                      <input
                        v-model.number="exerciseItem.reps"
                        type="number"
                        min="1"
                        class="set-input"
                      />
                    </div>
                    <div v-if="formData.type === 'strength'" class="set-input-group">
                      <label>Вес (кг)</label>
                      <input
                        v-model.number="exerciseItem.weight"
                        type="number"
                        min="0"
                        step="0.5"
                        class="set-input"
                      />
                    </div>
                    <div v-if="formData.type === 'cardio'" class="set-input-group">
                      <label>Длительность (сек)</label>
                      <input
                        v-model.number="exerciseItem.duration"
                        type="number"
                        min="1"
                        class="set-input"
                      />
                    </div>
                  </div>
                </div>
                <button class="remove-btn" @click="removeExercise(index)">×</button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Заметки</label>
            <textarea
              v-model="formData.notes"
              class="form-textarea"
              rows="3"
              placeholder="Добавьте заметки о тренировке..."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <BaseButton variant="outline" @click="handleClose">Отмена</BaseButton>
          <BaseButton variant="primary" @click="handleSave" :disabled="!canSave">
            {{ isEditing ? 'Сохранить' : 'Создать' }}
          </BaseButton>
        </div>
      </div>
    </div>
    </Transition>
  </Teleport>

  <!-- Модальное окно выбора упражнений -->
  <ExercisePickerModal
    v-if="showExercisePicker"
    :is-open="showExercisePicker"
    @close="showExercisePicker = false"
    @select="handleExerciseSelect"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import dayjs from 'dayjs';
import type { Workout, WorkoutExercise } from '@/types/workout.interface';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import { useExerciseStore } from '@/stores/useExerciseStore';
import BaseButton from '@/components/shared/BaseButton.vue';
import ExercisePickerModal from './ExercisePickerModal.vue';

interface Props {
  isOpen: boolean;
  workout?: Workout;
  initialDate?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  workout: undefined,
  initialDate: undefined
});

const emit = defineEmits<{
  close: [];
  save: [workout: Omit<Workout, 'id'>];
}>();

const workoutStore = useWorkoutStore();
const exerciseStore = useExerciseStore();
const showExercisePicker = ref(false);
const draggedIndex = ref<number | null>(null);

const isEditing = computed(() => !!props.workout);

const formData = ref<Omit<Workout, 'id' | 'completed'>>({
  date: props.initialDate || dayjs().format('YYYY-MM-DD'),
  type: 'strength',
  exercises: [],
  duration: 60,
  notes: ''
});

const resetForm = () => {
  formData.value = {
    date: props.initialDate || dayjs().format('YYYY-MM-DD'),
    type: 'strength',
    exercises: [],
    duration: 60,
    notes: ''
  };
};

watch(() => props.workout, (workout) => {
  if (workout) {
    formData.value = {
      date: workout.date,
      type: workout.type || 'strength',
      exercises: [...workout.exercises],
      duration: workout.duration,
      notes: workout.notes || ''
    };
  } else {
    resetForm();
  }
}, { immediate: true });

watch(() => props.isOpen, (open) => {
  if (!open) {
    resetForm();
  }
});

watch(() => props.initialDate, (date) => {
  if (date && !isEditing.value) {
    formData.value.date = date;
  }
});

const canSave = computed(() => {
  return formData.value.exercises.length > 0 && formData.value.duration > 0;
});

const getExerciseName = (exerciseId: string): string => {
  const exercise = exerciseStore.getExerciseById(exerciseId);
  return exercise?.name || 'Неизвестное упражнение';
};

const handleExerciseSelect = (exerciseId: string) => {
  const newExercise: WorkoutExercise = {
    exerciseId,
    sets: 3,
    reps: 10,
    weight: formData.value.type === 'strength' ? 0 : undefined,
    completed: false
  };
  
  formData.value.exercises.push(newExercise);
  showExercisePicker.value = false;
};

const removeExercise = (index: number) => {
  formData.value.exercises.splice(index, 1);
};

// Drag & Drop handlers
const handleDragStart = (index: number, event: DragEvent) => {
  draggedIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', index.toString());
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
};

const handleDrop = (dropIndex: number, event: DragEvent) => {
  event.preventDefault();
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) return;
  
  const exercises = [...formData.value.exercises];
  const draggedItem = exercises[draggedIndex.value];
  exercises.splice(draggedIndex.value, 1);
  exercises.splice(dropIndex, 0, draggedItem);
  
  formData.value.exercises = exercises;
  draggedIndex.value = null;
};

const handleDragEnd = () => {
  draggedIndex.value = null;
};

const handleSave = () => {
  if (!canSave.value) return;
  
  emit('save', formData.value);
  handleClose();
};

const handleClose = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-md;
}

.modal-container {
  background: $bg-secondary;
  border-radius: $radius-lg;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: $shadow-lg;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 1px solid $bg-tertiary;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: $text-primary;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: $radius-md;
  border: none;
  background: transparent;
  color: $text-secondary;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-base;

  &:hover {
    background: $bg-tertiary;
    color: $text-primary;
  }
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-lg;
}

.form-group {
  margin-bottom: $spacing-lg;
}

.form-label {
  display: block;
  margin-bottom: $spacing-sm;
  color: $text-secondary;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  border: 2px solid $bg-tertiary;
  background: $bg-tertiary;
  color: $text-primary;
  font-size: 1rem;
  font-family: inherit;
  transition: all $transition-base;

  &:focus {
    outline: none;
    border-color: $accent-1;
    background: $bg-primary;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.exercises-section {
  margin-top: $spacing-xl;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: $text-primary;
}

.empty-state {
  text-align: center;
  padding: $spacing-xl;
  color: $text-secondary;
  background: $bg-tertiary;
  border-radius: $radius-md;
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.exercise-item {
  background: $bg-tertiary;
  border-radius: $radius-md;
  padding: $spacing-md;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $spacing-md;
  cursor: move;
  transition: all $transition-base;
  position: relative;

  &:hover {
    background: $bg-secondary;
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }

  &.dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }
}

.drag-handle {
  color: $text-secondary;
  font-size: 1.25rem;
  cursor: grab;
  user-select: none;
  padding: $spacing-xs;
  display: flex;
  align-items: center;

  &:active {
    cursor: grabbing;
  }
}

.exercise-info {
  flex: 1;
}

.exercise-name {
  font-size: 1rem;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.exercise-sets {
  display: flex;
  gap: $spacing-md;
  flex-wrap: wrap;
}

.set-input-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  min-width: 80px;
}

.set-input-group label {
  font-size: 0.75rem;
  color: $text-secondary;
}

.set-input {
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-md;
  border: 2px solid $bg-primary;
  background: $bg-primary;
  color: $text-primary;
  font-size: 0.875rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: $accent-1;
  }
}

.remove-btn {
  width: 28px;
  height: 28px;
  border-radius: $radius-md;
  border: none;
  background: transparent;
  color: $accent-2;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-base;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
    transform: scale(1.1);
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-md;
  padding: $spacing-lg;
  border-top: 1px solid $bg-tertiary;
}

/* Transition анимации */
.modal-enter-active,
.modal-leave-active {
  transition: opacity $transition-base;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform $transition-base, opacity $transition-base;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
  opacity: 0;
}

@media (max-width: $breakpoint-mobile) {
  .modal-overlay {
    padding: 0;
  }

  .modal-container {
    max-height: 100vh;
    border-radius: 0;
  }

  .exercise-sets {
    flex-direction: column;
  }

  .set-input-group {
    min-width: 100%;
  }
}
</style>

