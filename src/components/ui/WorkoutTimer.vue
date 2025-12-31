<template>
  <div class="workout-timer">
    <div class="timer-display">
      <div class="time-value">{{ formattedTime }}</div>
      <div class="timer-controls">
        <button 
          v-if="!isRunning && !isPaused" 
          @click="start"
          class="timer-btn start"
        >
          ▶️ Старт
        </button>
        <button 
          v-if="isRunning" 
          @click="pause"
          class="timer-btn pause"
        >
          ⏸️ Пауза
        </button>
        <button 
          v-if="isPaused" 
          @click="start"
          class="timer-btn resume"
        >
          ▶️ Продолжить
        </button>
        <button 
          v-if="isRunning || isPaused" 
          @click="reset"
          class="timer-btn reset"
        >
          ⏹️ Сброс
        </button>
      </div>
    </div>
    
    <div class="timer-presets">
      <button
        v-for="preset in presets"
        :key="preset.value"
        @click="setTime(preset.value)"
        class="preset-btn"
      >
        {{ preset.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimer } from '@/composables/useTimer';
import { watch } from 'vue';

interface Props {
  initialSeconds?: number;
}

const props = withDefaults(defineProps<Props>(), {
  initialSeconds: 60
});

const emit = defineEmits<{
  finished: [];
}>();

const {
  formattedTime,
  isRunning,
  isPaused,
  start,
  pause,
  stop,
  reset: resetTimer,
  setTime
} = useTimer(props.initialSeconds);

const presets = [
  { label: '30с', value: 30 },
  { label: '1м', value: 60 },
  { label: '2м', value: 120 },
  { label: '5м', value: 300 },
  { label: '10м', value: 600 }
];

const reset = () => {
  resetTimer(props.initialSeconds);
};

watch([isRunning, isPaused], ([running, paused]) => {
  if (!running && !paused && formattedTime.value === '00:00') {
    emit('finished');
    playSound();
  }
});

const playSound = () => {
  // Создаем простой звуковой сигнал
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.workout-timer {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  text-align: center;
}

.timer-display {
  margin-bottom: $spacing-lg;
}

.time-value {
  font-size: 4rem;
  font-weight: 700;
  color: $accent-1;
  font-variant-numeric: tabular-nums;
  margin-bottom: $spacing-md;
  font-family: 'Inter', monospace;
}

.timer-controls {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  flex-wrap: wrap;
}

.timer-btn {
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-md;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: $bg-tertiary;
  color: $text-primary;
  transition: all $transition-base;
  font-size: 1rem;

  &:hover {
    background: $accent-1;
    transform: translateY(-2px);
  }

  &.start,
  &.resume {
    background: $accent-1;
    
    &:hover {
      background: #00B887;
    }
  }
}

.timer-presets {
  display: flex;
  gap: $spacing-sm;
  justify-content: center;
  flex-wrap: wrap;
}

.preset-btn {
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-md;
  border: 1px solid $bg-tertiary;
  background: transparent;
  color: $text-secondary;
  cursor: pointer;
  transition: all $transition-base;
  font-size: 0.875rem;

  &:hover {
    border-color: $accent-1;
    color: $accent-1;
  }
}

@media (max-width: $breakpoint-mobile) {
  .time-value {
    font-size: 3rem;
  }

  .timer-controls {
    flex-direction: column;
  }

  .timer-btn {
    width: 100%;
  }
}
</style>

