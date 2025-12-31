<template>
  <div class="achievement-card" :class="{ locked: !unlocked }">
    <div class="achievement-icon">
      <span class="icon-emoji">{{ icon }}</span>
    </div>
    <div class="achievement-content">
      <h4 class="achievement-title">{{ title }}</h4>
      <p class="achievement-description">{{ description }}</p>
      <div v-if="!unlocked && progress > 0" class="achievement-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
        </div>
        <span class="progress-text">{{ progress }} / {{ target }}</span>
      </div>
    </div>
    <div v-if="unlocked" class="achievement-badge">
      <span>✓</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0,
  target: 1
});

const progressPercentage = computed(() => {
  if (props.target === 0) return 0;
  return Math.min((props.progress / props.target) * 100, 100);
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.achievement-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: $bg-secondary;
  border-radius: $radius-lg;
  border: 2px solid transparent;
  transition: all $transition-base;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: $accent-1;
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }

  &.locked {
    opacity: 0.6;

    .achievement-icon {
      filter: grayscale(100%);
    }
  }
}

.achievement-icon {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-tertiary;
  border-radius: $radius-md;
  font-size: 2rem;
}

.icon-emoji {
  display: block;
}

.achievement-content {
  flex: 1;
  min-width: 0;
}

.achievement-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: $text-primary;
  margin: 0 0 $spacing-xs 0;
}

.achievement-description {
  font-size: 0.875rem;
  color: $text-secondary;
  margin: 0 0 $spacing-sm 0;
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-top: $spacing-sm;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: $bg-tertiary;
  border-radius: $radius-full;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $accent-1, $accent-2);
  border-radius: $radius-full;
  transition: width $transition-base;
}

.progress-text {
  font-size: 0.75rem;
  color: $text-secondary;
  white-space: nowrap;
}

.achievement-badge {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $accent-1;
  border-radius: 50%;
  color: $bg-primary;
  font-weight: 700;
  font-size: 1.125rem;
}
</style>

