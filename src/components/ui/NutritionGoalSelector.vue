<template>
  <div class="nutrition-goal-selector">
    <h3 class="selector-title">Выберите цель</h3>
    <div class="goal-options">
      <button
        v-for="option in goalOptions"
        :key="option.value"
        class="goal-option"
        :class="{ active: modelValue === option.value }"
        @click="$emit('update:modelValue', option.value)"
      >
        <span class="goal-icon">{{ option.icon }}</span>
        <div class="goal-content">
          <span class="goal-name">{{ option.label }}</span>
          <span class="goal-description">{{ option.description }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NutritionGoal } from '@/types/nutrition.interface';

interface Props {
  modelValue: NutritionGoal;
}

defineProps<Props>();

defineEmits<{
  'update:modelValue': [value: NutritionGoal];
}>();

const goalOptions = [
  {
    value: 'lose' as NutritionGoal,
    icon: '⬇️',
    label: 'Сброс веса',
    description: 'Создание дефицита калорий'
  },
  {
    value: 'maintain' as NutritionGoal,
    icon: '➡️',
    label: 'Поддержание',
    description: 'Баланс калорий'
  },
  {
    value: 'gain' as NutritionGoal,
    icon: '⬆️',
    label: 'Набор веса',
    description: 'Профицит калорий'
  }
];
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.nutrition-goal-selector {
  margin-bottom: $spacing-xl;
}

.selector-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-md;
}

.goal-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-md;
}

.goal-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-lg;
  background: $bg-secondary;
  border: 2px solid $bg-tertiary;
  border-radius: $radius-lg;
  cursor: pointer;
  transition: all $transition-base;
  text-align: center;

  &:hover {
    border-color: $accent-1;
    transform: translateY(-2px);
  }

  &.active {
    border-color: $accent-1;
    background: lighten($bg-secondary, 2%);
    box-shadow: 0 0 0 2px rgba($accent-1, 0.2);
  }
}

.goal-icon {
  font-size: 2.5rem;
  margin-bottom: $spacing-sm;
}

.goal-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.goal-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: $text-primary;
}

.goal-description {
  font-size: 0.875rem;
  color: $text-secondary;
}

@media (max-width: $breakpoint-mobile) {
  .goal-options {
    grid-template-columns: 1fr;
  }
}
</style>

