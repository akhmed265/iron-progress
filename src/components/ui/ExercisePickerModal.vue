<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">Выберите упражнение</h2>
          <button class="modal-close" @click="$emit('close')">×</button>
        </div>

        <div class="modal-content">
          <div class="search-section">
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Поиск упражнений..."
            />
          </div>

          <div class="exercises-list">
            <div
              v-for="exercise in filteredExercises"
              :key="exercise.id"
              class="exercise-item"
              @click="handleSelect(exercise.id)"
            >
              <div class="exercise-info">
                <h4 class="exercise-name">{{ exercise.name }}</h4>
                <p class="exercise-description">{{ exercise.description }}</p>
                <div class="exercise-tags">
                  <span
                    v-for="group in exercise.muscleGroup"
                    :key="group"
                    class="tag"
                  >
                    {{ getMuscleGroupLabel(group) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredExercises.length === 0" class="empty-state">
            <p>Не найдено упражнений</p>
          </div>
        </div>
      </div>
    </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useExerciseStore } from '@/stores/useExerciseStore';
import type { MuscleGroup } from '@/types/exercise.interface';

interface Props {
  isOpen: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
  select: [exerciseId: string];
}>();

const exerciseStore = useExerciseStore();
const searchQuery = ref('');

const filteredExercises = computed(() => {
  if (!searchQuery.value) {
    return exerciseStore.exercises;
  }

  const query = searchQuery.value.toLowerCase();
  return exerciseStore.exercises.filter(ex =>
    ex.name.toLowerCase().includes(query) ||
    ex.description.toLowerCase().includes(query)
  );
});

const getMuscleGroupLabel = (group: MuscleGroup): string => {
  const labels: Record<MuscleGroup, string> = {
    chest: 'Грудь',
    back: 'Спина',
    legs: 'Ноги',
    arms: 'Руки',
    shoulders: 'Плечи',
    core: 'Пресс'
  };
  return labels[group] || group;
};

const handleSelect = (exerciseId: string) => {
  emit('select', exerciseId);
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
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: $spacing-md;
}

.modal-container {
  background: $bg-secondary;
  border-radius: $radius-lg;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
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

.search-section {
  margin-bottom: $spacing-lg;
}

.search-input {
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

  &::placeholder {
    color: $text-secondary;
  }
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.exercise-item {
  background: $bg-tertiary;
  border-radius: $radius-md;
  padding: $spacing-md;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    background: rgba(45, 45, 68, 0.8);
    transform: translateX(4px);
    border-left: 3px solid $accent-1;
  }
}

.exercise-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.exercise-name {
  font-size: 1rem;
  font-weight: 600;
  color: $text-primary;
}

.exercise-description {
  font-size: 0.875rem;
  color: $text-secondary;
  line-height: 1.4;
}

.exercise-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
  margin-top: $spacing-xs;
}

.tag {
  padding: 2px $spacing-xs;
  border-radius: $radius-sm;
  font-size: 0.75rem;
  background: rgba(0, 168, 255, 0.15);
  color: $accent-3;
}

.empty-state {
  text-align: center;
  padding: $spacing-xl;
  color: $text-secondary;
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
}
</style>

