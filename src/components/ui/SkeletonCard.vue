<template>
  <div class="skeleton-card" :class="{ 'skeleton-card--compact': compact }">
    <div class="skeleton-card__header" v-if="showHeader">
      <div class="skeleton-line skeleton-line--title"></div>
    </div>
    <div class="skeleton-card__content">
      <div class="skeleton-line" v-for="n in lines" :key="n" :style="{ width: getLineWidth(n) }"></div>
    </div>
    <div class="skeleton-card__footer" v-if="showFooter">
      <div class="skeleton-line skeleton-line--button"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  lines?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  compact?: boolean;
}

withDefaults(defineProps<Props>(), {
  lines: 3,
  showHeader: true,
  showFooter: false,
  compact: false
});

const getLineWidth = (index: number) => {
  const widths = ['100%', '85%', '95%', '90%'];
  return widths[(index - 1) % widths.length];
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.skeleton-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  animation: pulse 1.5s ease-in-out infinite;

  &--compact {
    padding: $spacing-md;
  }
}

.skeleton-card__header {
  margin-bottom: $spacing-md;
}

.skeleton-card__content {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.skeleton-card__footer {
  margin-top: $spacing-md;
  display: flex;
  justify-content: flex-end;
}

.skeleton-line {
  height: 1rem;
  background: linear-gradient(
    90deg,
    $bg-tertiary 0%,
    lighten($bg-tertiary, 5%) 50%,
    $bg-tertiary 100%
  );
  background-size: 200% 100%;
  border-radius: $radius-sm;
  animation: shimmer 1.5s infinite;

  &--title {
    height: 1.5rem;
    width: 60%;
  }

  &--button {
    height: 2.5rem;
    width: 120px;
    border-radius: $radius-md;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>

