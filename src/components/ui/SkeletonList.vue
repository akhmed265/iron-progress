<template>
  <div class="skeleton-list">
    <SkeletonCard
      v-for="n in count"
      :key="n"
      :lines="lines"
      :show-header="showHeader"
      :show-footer="showFooter"
      :compact="compact"
    />
  </div>
</template>

<script setup lang="ts">
import SkeletonCard from './SkeletonCard.vue';

interface Props {
  count?: number;
  lines?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  compact?: boolean;
}

withDefaults(defineProps<Props>(), {
  count: 3,
  lines: 3,
  showHeader: true,
  showFooter: false,
  compact: false
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}
</style>

