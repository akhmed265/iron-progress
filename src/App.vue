<template>
  <div id="app">
    <LoadingDumbbell @loaded="handleLoaded" />
    
    <div v-if="!isLoading" class="app-container">
      <AppHeader />
      <main class="main-content">
        <router-view />
      </main>
      <AppFooter />
      <ToastContainer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import { useUserStore } from '@/stores/useUserStore';
import { useExerciseStore } from '@/stores/useExerciseStore';
import { useGoalStore } from '@/stores/useGoalStore';
import LoadingDumbbell from '@/components/layout/LoadingDumbbell.vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import ToastContainer from '@/components/ui/ToastContainer.vue';

const isLoading = ref(true);
const workoutStore = useWorkoutStore();
const userStore = useUserStore();
const exerciseStore = useExerciseStore();
const goalStore = useGoalStore();

const handleLoaded = () => {
  isLoading.value = false;
};

onMounted(async () => {
  // Загружаем данные из LocalStorage
  userStore.loadUserData();
  workoutStore.loadUserData();
  exerciseStore.loadExercises();
  goalStore.loadGoals();
  
  // Применяем тему
  const theme = userStore.preferences.value?.theme || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  
  // Минимальное время показа анимации
  setTimeout(() => {
    if (isLoading.value) {
      handleLoaded();
    }
  }, 2500);
});
</script>

<style lang="scss">
// Стили уже подключены в global.scss
</style>

