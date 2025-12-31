<template>
  <div class="goal-card" :class="{ completed: goal.completed }">
    <div class="goal-header">
      <h3 class="goal-title">{{ goalLabel }}</h3>
      <span v-if="goal.completed" class="goal-badge">✓ Выполнено</span>
    </div>
    <div class="goal-progress">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      <div class="progress-text">
        <span>{{ goal.current }} / {{ goal.target }}</span>
        <span class="percentage">{{ Math.round(progressPercentage) }}%</span>
      </div>
    </div>
    <div v-if="goal.deadline" class="goal-deadline">
      До: {{ formatDate(goal.deadline) }}
    </div>
    <button v-if="!goal.completed" class="goal-delete" @click="$emit('delete')" title="Удалить цель">
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import type { Goal } from '@/types/goal.interface';

interface Props {
  goal: Goal;
}

const props = defineProps<Props>();

defineEmits<{
  delete: [];
}>();

const goalLabel = computed(() => {
  const labels: Record<Goal['type'], string> = {
    workouts_per_month: 'Тренировок в месяц',
    workouts_per_week: 'Тренировок в неделю',
    volume_per_month: 'Объем в месяц (кг)',
    streak_days: 'Дней подряд'
  };
  return labels[props.goal.type] || 'Цель';
});

const progressPercentage = computed(() => {
  if (props.goal.target === 0) return 0;
  return Math.min((props.goal.current / props.goal.target) * 100, 100);
});

const formatDate = (date: string) => {
  return dayjs(date).format('D MMMM YYYY');
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.goal-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  position: relative;
  border: 2px solid transparent;
  transition: all $transition-base;

  &:hover {
    border-color: $accent-1;
  }

  &.completed {
    background: rgba(0, 200, 150, 0.1);
    border-color: $accent-1;
  }
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.goal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: $text-primary;
  margin: 0;
}

.goal-badge {
  font-size: 0.875rem;
  color: $accent-1;
  font-weight: 600;
}

.goal-progress {
  margin-bottom: $spacing-sm;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: $bg-tertiary;
  border-radius: $radius-full;
  overflow: hidden;
  margin-bottom: $spacing-xs;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $accent-1, $accent-2);
  border-radius: $radius-full;
  transition: width $transition-base;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: $text-secondary;
}

.percentage {
  font-weight: 600;
  color: $text-primary;
}

.goal-deadline {
  font-size: 0.75rem;
  color: $text-muted;
  margin-top: $spacing-xs;
}

.goal-delete {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: $text-secondary;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: color $transition-base;

  &:hover {
    color: #FF6B6B;
  }
}
</style>

