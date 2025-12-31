import { ref, onMounted } from 'vue';

export function useLoading(minLoadingTime: number = 2500) {
  const isLoading = ref(true);
  const startTime = Date.now();

  const finish = () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minLoadingTime - elapsed);
    
    setTimeout(() => {
      isLoading.value = false;
    }, remaining);
  };

  onMounted(() => {
    // Автоматически завершаем загрузку после минимального времени
    setTimeout(() => {
      if (isLoading.value) {
        finish();
      }
    }, minLoadingTime);
  });

  return {
    isLoading,
    finish
  };
}

