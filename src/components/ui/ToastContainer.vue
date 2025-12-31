<template>
  <Teleport to="body">
    <TransitionGroup
      name="toast"
      tag="div"
      class="toast-container"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast-${toast.type}`"
        @click="remove(toast.id)"
      >
        <div class="toast-icon">
          <span v-if="toast.icon" class="icon-emoji">{{ toast.icon }}</span>
          <span v-else class="icon-default">{{ getDefaultIcon(toast.type) }}</span>
        </div>
        <div class="toast-content">
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button class="toast-close" @click.stop="remove(toast.id)" aria-label="Закрыть">
          ×
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast, type ToastType } from '@/composables/useToast';

const { toasts, remove } = useToast();

const getDefaultIcon = (type: ToastType): string => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
    default:
      return 'ℹ';
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.toast-container {
  position: fixed;
  top: 80px;
  right: $spacing-lg;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  pointer-events: none;
  max-width: 400px;
  width: 100%;

  @media (max-width: $breakpoint-mobile) {
    right: $spacing-md;
    left: $spacing-md;
    top: 70px;
    max-width: none;
  }
}

.toast {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  background: $bg-secondary;
  border-radius: $radius-lg;
  box-shadow: $shadow-lg;
  border-left: 4px solid;
  pointer-events: all;
  cursor: pointer;
  transition: all $transition-base;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateX(-4px);
    box-shadow: $shadow-lg;
  }

  &.toast-success {
    border-left-color: $accent-1;
    
    .toast-icon {
      color: $accent-1;
    }
  }

  &.toast-error {
    border-left-color: #FF6B6B;
    
    .toast-icon {
      color: #FF6B6B;
    }
  }

  &.toast-warning {
    border-left-color: #FFD93D;
    
    .toast-icon {
      color: #FFD93D;
    }
  }

  &.toast-info {
    border-left-color: $accent-3;
    
    .toast-icon {
      color: $accent-3;
    }
  }
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
}

.icon-emoji {
  font-size: 1.5rem;
  line-height: 1;
}

.icon-default {
  font-size: 1.125rem;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-message {
  margin: 0;
  font-size: 0.875rem;
  color: $text-primary;
  line-height: 1.5;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: $text-secondary;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  transition: color $transition-base;

  &:hover {
    color: $text-primary;
  }
}

/* Анимации появления и исчезновения */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

@media (max-width: $breakpoint-mobile) {
  .toast {
    padding: $spacing-sm $spacing-md;
  }

  .toast-message {
    font-size: 0.8125rem;
  }

  .toast-enter-from {
    transform: translateX(0) translateY(-20px);
  }

  .toast-leave-to {
    transform: translateX(0) translateY(-20px);
  }
}
</style>

