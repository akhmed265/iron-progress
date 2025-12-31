<template>
  <div class="exercise-card" @click="$emit('click')">
    <div class="exercise-header">
      <h3 class="exercise-name">{{ exercise.name }}</h3>
      <span class="difficulty-badge" :class="exercise.difficulty">
        {{ difficultyLabel }}
      </span>
    </div>
    
    <p class="exercise-description">{{ exercise.description }}</p>
    
    <div class="exercise-tags">
      <span 
        v-for="group in exercise.muscleGroup" 
        :key="group"
        class="tag muscle-group"
      >
        {{ muscleGroupLabels[group] }}
      </span>
      <span 
        v-for="eq in exercise.equipment" 
        :key="eq"
        class="tag equipment"
      >
        {{ equipmentLabels[eq] }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Exercise, MuscleGroup, Equipment, Difficulty } from '@/types/exercise.interface';
import { computed } from 'vue';

interface Props {
  exercise: Exercise;
}

const props = defineProps<Props>();

defineEmits<{
  click: [];
}>();

const difficultyLabels: Record<Difficulty, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый'
};

const muscleGroupLabels: Record<MuscleGroup, string> = {
  chest: 'Грудь',
  back: 'Спина',
  legs: 'Ноги',
  arms: 'Руки',
  shoulders: 'Плечи',
  core: 'Пресс'
};

const equipmentLabels: Record<Equipment, string> = {
  barbell: 'Штанга',
  dumbbell: 'Гантели',
  machine: 'Тренажер',
  bodyweight: 'Собственный вес',
  kettlebell: 'Гиря'
};

const difficultyLabel = computed(() => difficultyLabels[props.exercise.difficulty]);
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.exercise-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  cursor: pointer;
  transition: all $transition-base;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    border-color: $accent-1;
  }
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
}

.exercise-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: $text-primary;
  flex: 1;
}

.difficulty-badge {
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-md;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;

  &.beginner {
    background: rgba(0, 200, 150, 0.2);
    color: $accent-1;
  }

  &.intermediate {
    background: rgba(0, 168, 255, 0.2);
    color: $accent-3;
  }

  &.advanced {
    background: rgba(255, 107, 107, 0.2);
    color: $accent-2;
  }
}

.exercise-description {
  color: $text-secondary;
  margin-bottom: $spacing-md;
  line-height: 1.6;
}

.exercise-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.tag {
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-md;
  font-size: 0.75rem;
  font-weight: 500;

  &.muscle-group {
    background: rgba(0, 168, 255, 0.15);
    color: $accent-3;
  }

  &.equipment {
    background: rgba(255, 107, 107, 0.15);
    color: $accent-2;
  }
}
</style>

