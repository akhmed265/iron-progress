<template>
  <div class="progress-chart">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-period-toggle">
        <button
          v-for="period in periods"
          :key="period.value"
          @click="selectedPeriod = period.value"
          class="period-button"
          :class="{ active: selectedPeriod === period.value }"
        >
          {{ period.label }}
        </button>
      </div>
    </div>
    <div class="chart-container">
      <svg :viewBox="`0 0 ${width} ${height}`" class="chart-svg">
        <!-- Сетка -->
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#00C896;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#00C896;stop-opacity:0.05" />
          </linearGradient>
        </defs>
        
        <!-- Горизонтальные линии сетки -->
        <line
          v-for="i in 5"
          :key="`grid-${i}`"
          :x1="padding"
          :y1="padding + ((height - padding * 2) / 5) * i"
          :x2="width - padding"
          :y2="padding + ((height - padding * 2) / 5) * i"
          stroke="#2D2D44"
          stroke-width="1"
        />
        
        <!-- Область графика -->
        <polygon
          :points="areaPoints"
          fill="url(#chartGradient)"
        />
        
        <!-- Линия графика -->
        <polyline
          :points="linePoints"
          fill="none"
          stroke="#00C896"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        
        <!-- Точки данных -->
        <circle
          v-for="(point, index) in dataPoints"
          :key="index"
          :cx="point.x"
          :cy="point.y"
          r="4"
          fill="#00C896"
          stroke="#0F0F1A"
          stroke-width="2"
        />
        
        <!-- Подписи осей X -->
        <text
          v-for="(label, index) in xLabels"
          :key="index"
          :x="padding + (index * (width - padding * 2) / (chartData.length - 1))"
          :y="height - padding + 20"
          text-anchor="middle"
          fill="#A1A1AA"
          font-size="12"
        >
          {{ label }}
        </text>
      </svg>
      
      <div v-if="chartData.length === 0" class="chart-empty">
        <p>Нет данных для отображения</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import dayjs from 'dayjs';

interface Props {
  data: number[]; // Массив значений для отображения
  labels?: string[]; // Подписи для оси X
  title?: string;
  period?: 'week' | 'month';
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  labels: undefined,
  title: 'Прогресс тренировок',
  period: 'week'
});

const selectedPeriod = ref<'week' | 'month'>(props.period);

const emit = defineEmits<{
  'update:period': [value: 'week' | 'month'];
}>();

watch(() => props.period, (newPeriod) => {
  selectedPeriod.value = newPeriod;
});

const handlePeriodChange = (period: 'week' | 'month') => {
  selectedPeriod.value = period;
  emit('update:period', period);
};
const width = 400;
const height = 200;
const padding = 40;

const periods = [
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' }
];

const chartData = computed(() => {
  return props.data.length > 0 ? props.data : [];
});

const maxValue = computed(() => {
  if (chartData.value.length === 0) return 1;
  const max = Math.max(...chartData.value);
  return max > 0 ? max : 1;
});

const xLabels = computed(() => {
  if (props.labels) return props.labels;
  
  if (selectedPeriod.value === 'week') {
    return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  } else {
    const labels: string[] = [];
    const weeks = Math.ceil(chartData.value.length / 7);
    for (let i = 0; i < weeks; i++) {
      labels.push(`${i + 1} нед`);
    }
    return labels.length > 0 ? labels : ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4'];
  }
});

const dataPoints = computed(() => {
  if (chartData.value.length === 0) return [];
  
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  return chartData.value.map((value, index) => {
    const x = padding + (index * chartWidth / Math.max(chartData.value.length - 1, 1));
    const y = padding + chartHeight - (value / maxValue.value) * chartHeight;
    return { x, y, value };
  });
});

const linePoints = computed(() => {
  return dataPoints.value.map(p => `${p.x},${p.y}`).join(' ');
});

const areaPoints = computed(() => {
  if (dataPoints.value.length === 0) return '';
  const first = dataPoints.value[0];
  const last = dataPoints.value[dataPoints.value.length - 1];
  const bottomY = height - padding;
  return `${padding},${bottomY} ${dataPoints.value.map(p => `${p.x},${p.y}`).join(' ')} ${last.x},${bottomY}`;
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.progress-chart {
  width: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: $text-primary;
  margin: 0;
}

.chart-period-toggle {
  display: flex;
  gap: $spacing-xs;
  background: $bg-tertiary;
  border-radius: $radius-md;
  padding: 4px;
}

.period-button {
  padding: $spacing-xs $spacing-md;
  background: transparent;
  border: none;
  border-radius: $radius-sm;
  color: $text-secondary;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    color: $text-primary;
    background: $bg-secondary;
  }

  &.active {
    background: $accent-1;
    color: $bg-primary;
    font-weight: 600;
  }
}

.chart-container {
  position: relative;
  width: 100%;
  padding: $spacing-md;
  background: $bg-tertiary;
  border-radius: $radius-md;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-svg {
  width: 100%;
  height: 100%;
  max-height: 250px;
}

.chart-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: $text-secondary;
  text-align: center;
}

@media (max-width: $breakpoint-mobile) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .chart-container {
    min-height: 200px;
  }

  .chart-svg {
    max-height: 200px;
  }
}
</style>

