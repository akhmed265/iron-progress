<template>
  <div class="calendar-grid">
    <div class="calendar-header">
      <button @click="previousWeek" class="nav-btn">‹</button>
      <h3 class="calendar-title">{{ weekRange }}</h3>
      <button @click="nextWeek" class="nav-btn">›</button>
    </div>
    
    <div class="calendar-days">
      <div
        v-for="day in weekDays"
        :key="day.date"
        class="calendar-day"
        :class="{
          today: day.isToday,
          hasWorkout: day.hasWorkout,
          completed: day.isCompleted
        }"
        @click="$emit('day-click', day.date)"
      >
        <div class="day-name">{{ day.name }}</div>
        <div class="day-number">{{ day.number }}</div>
        <div v-if="day.hasWorkout" class="workout-indicator">
          <span class="workout-dot" :class="{ completed: day.isCompleted }"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useWorkoutStore } from '@/stores/useWorkoutStore';

dayjs.locale('ru');

interface DayInfo {
  date: string;
  name: string;
  number: number;
  isToday: boolean;
  hasWorkout: boolean;
  isCompleted: boolean;
}

const emit = defineEmits<{
  'day-click': [date: string];
}>();

const workoutStore = useWorkoutStore();
const currentWeekStart = ref(dayjs().startOf('week'));

const weekDays = computed(() => {
  const days: DayInfo[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = currentWeekStart.value.add(i, 'day');
    const dateStr = date.format('YYYY-MM-DD');
    const isToday = date.isSame(dayjs(), 'day');
    const workouts = workoutStore.getWorkoutsByDate(dateStr);
    const hasWorkout = workouts.length > 0;
    const isCompleted = workouts.some(w => w.completed);
    
    days.push({
      date: dateStr,
      name: date.format('ddd'),
      number: date.date(),
      isToday,
      hasWorkout,
      isCompleted
    });
  }
  
  return days;
});

const weekRange = computed(() => {
  const start = currentWeekStart.value.format('D MMM');
  const end = currentWeekStart.value.add(6, 'day').format('D MMM YYYY');
  return `${start} - ${end}`;
});

const previousWeek = () => {
  currentWeekStart.value = currentWeekStart.value.subtract(1, 'week');
};

const nextWeek = () => {
  currentWeekStart.value = currentWeekStart.value.add(1, 'week');
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.calendar-grid {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-lg;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border-radius: $radius-md;
  border: 1px solid $bg-tertiary;
  background: transparent;
  color: $text-primary;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all $transition-base;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: $bg-tertiary;
    border-color: $accent-1;
  }
}

.calendar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: $text-primary;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: $spacing-sm;
}

.calendar-day {
  aspect-ratio: 1;
  border-radius: $radius-md;
  padding: $spacing-sm;
  background: $bg-tertiary;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all $transition-base;
  position: relative;
  border: 2px solid transparent;

  &:hover {
    background: rgba(45, 45, 68, 0.8);
    transform: translateY(-2px);
  }

  &.today {
    border-color: $accent-1;
    background: rgba(0, 200, 150, 0.1);
  }

  &.hasWorkout {
    background: rgba(0, 168, 255, 0.1);
  }

  &.completed {
    background: rgba(0, 200, 150, 0.2);
  }
}

.day-name {
  font-size: 0.75rem;
  color: $text-secondary;
  text-transform: uppercase;
  margin-bottom: $spacing-xs;
}

.day-number {
  font-size: 1.5rem;
  font-weight: 600;
  color: $text-primary;
}

.workout-indicator {
  position: absolute;
  top: $spacing-xs;
  right: $spacing-xs;
}

.workout-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $accent-3;

  &.completed {
    background: $accent-1;
  }
}

@media (max-width: $breakpoint-mobile) {
  .calendar-days {
    gap: $spacing-xs;
  }

  .day-number {
    font-size: 1.25rem;
  }

  .day-name {
    font-size: 0.625rem;
  }
}
</style>

