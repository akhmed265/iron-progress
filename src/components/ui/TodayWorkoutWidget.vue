<template>
  <div v-if="workout" class="today-workout-widget" @click="handleClick">
    <div class="widget-content">
      <div class="widget-icon">
        <img :src="timerIcon" alt="Тренировка" />
      </div>
      <div class="widget-info">
        <h3 class="widget-title">
          Запланирована тренировка
          <span v-if="workoutDateLabel" class="workout-date">• {{ workoutDateLabel }}</span>
        </h3>
        <p class="widget-subtitle">
          {{ workout.exercises.length }} упражнений • {{ workout.duration }} мин
          <span v-if="workout.type" class="workout-type">
            ({{ workoutTypeLabel }})
          </span>
        </p>
      </div>
      <div class="widget-arrow">→</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import timerIcon from '@/assets/icons/timer-white.svg';
import type { Workout } from '@/types/workout.interface';

interface Props {
  workout: Workout | null;
}

const props = defineProps<Props>();
const router = useRouter();

const workoutTypeLabel = computed(() => {
  if (!props.workout?.type) return '';
  const types: Record<string, string> = {
    strength: 'Силовая',
    cardio: 'Кардио',
    flexibility: 'Растяжка'
  };
  return types[props.workout.type] || '';
});

const workoutDateLabel = computed(() => {
  if (!props.workout) return '';
  const today = dayjs().startOf('day');
  const workoutDate = dayjs(props.workout.date).startOf('day');
  const diffDays = workoutDate.diff(today, 'day');
  
  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Завтра';
  if (diffDays === 2) return 'Послезавтра';
  return workoutDate.format('D MMMM');
});

const handleClick = () => {
  if (props.workout) {
    router.push({ name: 'workout', params: { id: props.workout.id } });
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.today-workout-widget {
  background: linear-gradient(135deg, $accent-1, #00B887);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-xl;
  cursor: pointer;
  transition: all $transition-base;
  box-shadow: $shadow-md;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }
}

.widget-content {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.widget-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: $radius-md;
  flex-shrink: 0;

  img {
    width: 24px;
    height: 24px;
    filter: brightness(0) invert(1);
  }
}

.widget-info {
  flex: 1;
  min-width: 0;
}

.widget-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin-bottom: $spacing-xs;
}

.widget-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
}

.workout-type {
  opacity: 0.8;
}

.workout-date {
  font-size: 0.9em;
  opacity: 0.9;
  font-weight: 400;
}

.widget-arrow {
  font-size: 1.5rem;
  color: white;
  opacity: 0.8;
  flex-shrink: 0;
}

@media (max-width: $breakpoint-mobile) {
  .today-workout-widget {
    padding: $spacing-md;
  }

  .widget-icon {
    width: 40px;
    height: 40px;

    img {
      width: 20px;
      height: 20px;
    }
  }

  .widget-title {
    font-size: 1rem;
  }

  .widget-subtitle {
    font-size: 0.75rem;
  }
}
</style>
