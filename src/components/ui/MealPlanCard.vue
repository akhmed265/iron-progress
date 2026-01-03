<template>
  <div class="meal-plan-card" :class="{ 'meal-plan-card--recommended': plan.isRecommended }">
    <div class="meal-plan-card__header">
      <div class="meal-plan-card__title-section">
        <h3 class="meal-plan-card__name">{{ plan.name }}</h3>
        <span v-if="plan.isRecommended" class="recommended-badge">Рекомендуется</span>
      </div>
      <button 
        v-if="!plan.isRecommended && showDelete"
        class="delete-button"
        @click.stop="$emit('delete', plan.id)"
        aria-label="Удалить план"
      >
        ✕
      </button>
    </div>

    <div class="meal-plan-card__macros">
      <div class="macro-item">
        <span class="macro-value">{{ plan.totalCalories }}</span>
        <span class="macro-label">ккал</span>
      </div>
      <div class="macro-item">
        <span class="macro-value">{{ plan.totalProtein }}г</span>
        <span class="macro-label">Белки</span>
      </div>
      <div class="macro-item">
        <span class="macro-value">{{ plan.totalFat }}г</span>
        <span class="macro-label">Жиры</span>
      </div>
      <div class="macro-item">
        <span class="macro-value">{{ plan.totalCarbs }}г</span>
        <span class="macro-label">Углеводы</span>
      </div>
    </div>

    <div class="meal-plan-card__meals">
      <div 
        v-for="(meal, index) in plan.meals" 
        :key="index"
        class="meal-item"
      >
        <span class="meal-type">{{ getMealTypeLabel(meal.type) }}</span>
        <span class="meal-name">{{ meal.name }}</span>
      </div>
    </div>

    <div class="meal-plan-card__actions">
      <BaseButton 
        variant="primary" 
        size="small"
        @click="$emit('use', plan)"
      >
        Использовать
      </BaseButton>
      <BaseButton 
        v-if="!plan.isRecommended"
        variant="outline" 
        size="small"
        @click="$emit('edit', plan)"
      >
        Редактировать
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/shared/BaseButton.vue';
import type { MealPlan, MealType } from '@/types/nutrition.interface';

interface Props {
  plan: MealPlan;
  showDelete?: boolean;
}

withDefaults(defineProps<Props>(), {
  showDelete: true
});

defineEmits<{
  use: [plan: MealPlan];
  edit: [plan: MealPlan];
  delete: [id: string];
}>();

const mealTypeLabels: Record<MealType, string> = {
  breakfast: 'Завтрак',
  lunch: 'Обед',
  dinner: 'Ужин',
  snack: 'Перекус'
};

function getMealTypeLabel(type: MealType): string {
  return mealTypeLabels[type] || type;
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.meal-plan-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  border: 2px solid $bg-tertiary;
  transition: all $transition-base;

  &:hover {
    border-color: $accent-1;
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }

  &--recommended {
    border-color: $accent-1;
    background: linear-gradient(135deg, $bg-secondary 0%, lighten($bg-secondary, 2%) 100%);
  }
}

.meal-plan-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-md;
}

.meal-plan-card__title-section {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  flex: 1;
}

.meal-plan-card__name {
  font-size: 1.25rem;
  font-weight: 600;
  color: $text-primary;
  margin: 0;
}

.recommended-badge {
  font-size: 0.75rem;
  padding: $spacing-xs $spacing-sm;
  background: $accent-1;
  color: $bg-primary;
  border-radius: $radius-full;
  font-weight: 600;
}

.delete-button {
  background: transparent;
  border: none;
  color: $text-secondary;
  font-size: 1.5rem;
  cursor: pointer;
  padding: $spacing-xs;
  line-height: 1;
  transition: color $transition-base;

  &:hover {
    color: $accent-2;
  }
}

.meal-plan-card__macros {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
  padding: $spacing-md;
  background: $bg-tertiary;
  border-radius: $radius-md;
}

.macro-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
}

.macro-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: $text-primary;
}

.macro-label {
  font-size: 0.75rem;
  color: $text-secondary;
}

.meal-plan-card__meals {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  margin-bottom: $spacing-md;
  padding: $spacing-md;
  background: $bg-tertiary;
  border-radius: $radius-md;
}

.meal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-xs 0;
  border-bottom: 1px solid $bg-secondary;

  &:last-child {
    border-bottom: none;
  }
}

.meal-type {
  font-size: 0.875rem;
  font-weight: 600;
  color: $accent-1;
  min-width: 80px;
}

.meal-name {
  font-size: 0.875rem;
  color: $text-primary;
}

.meal-plan-card__actions {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

@media (max-width: $breakpoint-mobile) {
  .meal-plan-card__macros {
    grid-template-columns: repeat(2, 1fr);
  }

  .meal-plan-card__actions {
    flex-direction: column;
  }
}
</style>

