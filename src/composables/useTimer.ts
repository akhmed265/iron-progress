import { ref, computed, onUnmounted } from 'vue';

export function useTimer(initialSeconds: number = 0) {
  const seconds = ref(initialSeconds);
  const isRunning = ref(false);
  const isPaused = ref(false);
  let intervalId: number | null = null;

  const minutes = computed(() => Math.floor(seconds.value / 60));
  const remainingSeconds = computed(() => seconds.value % 60);
  const formattedTime = computed(() => {
    const mins = minutes.value.toString().padStart(2, '0');
    const secs = remainingSeconds.value.toString().padStart(2, '0');
    return `${mins}:${secs}`;
  });

  const start = () => {
    if (intervalId) return;
    isRunning.value = true;
    isPaused.value = false;
    
    intervalId = window.setInterval(() => {
      if (seconds.value > 0) {
        seconds.value--;
      } else {
        stop();
      }
    }, 1000);
  };

  const pause = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    isPaused.value = true;
    isRunning.value = false;
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    isRunning.value = false;
    isPaused.value = false;
  };

  const reset = (newSeconds?: number) => {
    stop();
    seconds.value = newSeconds ?? initialSeconds;
  };

  const setTime = (newSeconds: number) => {
    seconds.value = newSeconds;
  };

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  return {
    seconds,
    minutes,
    remainingSeconds,
    formattedTime,
    isRunning,
    isPaused,
    start,
    pause,
    stop,
    reset,
    setTime
  };
}

