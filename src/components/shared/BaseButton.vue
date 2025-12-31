<template>
  <button
    :class="['base-button', variant, size, { disabled: disabled }]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false
});

defineEmits<{
  click: [];
}>();
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.base-button {
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-md;
  font-weight: 500;
  transition: all $transition-base;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  font-family: inherit;
  border: 2px solid transparent;

  &.small {
    padding: $spacing-xs $spacing-md;
    font-size: 0.875rem;
  }

  &.medium {
    padding: $spacing-sm $spacing-lg;
    font-size: 1rem;
  }

  &.large {
    padding: $spacing-md $spacing-xl;
    font-size: 1.125rem;
  }

  &.primary {
    background: $accent-1;
    color: $text-primary;

    &:hover:not(.disabled) {
      background: #00B887;
      transform: translateY(-2px);
      box-shadow: $shadow-md;
    }
  }

  &.secondary {
    background: $accent-3;
    color: $text-primary;

    &:hover:not(.disabled) {
      background: #0097E6;
      transform: translateY(-2px);
      box-shadow: $shadow-md;
    }
  }

  &.outline {
    background: transparent;
    border-color: $accent-1;
    color: $accent-1;

    &:hover:not(.disabled) {
      background: $accent-1;
      color: $text-primary;
    }
  }

  &.ghost {
    background: transparent;
    color: $text-secondary;

    &:hover:not(.disabled) {
      background: $bg-tertiary;
      color: $text-primary;
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>

