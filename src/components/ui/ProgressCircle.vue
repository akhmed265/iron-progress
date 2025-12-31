<template>
  <div class="progress-circle" :style="{ width: size, height: size }">
    <svg :width="size" :height="size" class="progress-svg">
      <circle
        class="progress-bg"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
      />
      <circle
        class="progress-bar"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
      />
    </svg>
    <div class="progress-content">
      <div class="progress-value">{{ Math.round(percentage) }}%</div>
      <div class="progress-label" v-if="label">{{ label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  percentage: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 120,
  strokeWidth: 10,
  label: ''
});

const center = computed(() => props.size / 2);
const radius = computed(() => (props.size - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const offset = computed(() => circumference.value - (props.percentage / 100) * circumference.value);
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.progress-circle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.progress-svg {
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: $bg-tertiary;
}

.progress-bar {
  fill: none;
  stroke: $accent-1;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}

.progress-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: $text-primary;
}

.progress-label {
  font-size: 0.875rem;
  color: $text-secondary;
  margin-top: $spacing-xs;
}
</style>

