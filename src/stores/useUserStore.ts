import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, UserStats, UserPreferences } from '@/types/user.interface';
import { useLocalStorage } from '@/composables/useLocalStorage';

export const useUserStore = defineStore('user', () => {
  const storage = useLocalStorage<User>('iron-progress-user', {
    id: 'user-1',
    name: 'Спортсмен',
    goals: [],
    preferences: {
      theme: 'dark',
      units: 'metric',
      notifications: true,
      soundEnabled: true
    }
  });

  const storageStats = useLocalStorage<UserStats>('iron-progress-stats', {
    totalWorkouts: 0,
    totalVolume: 0,
    personalRecords: {},
    streakDays: 0
  });

  const user = ref<User>(storage.read());
  const stats = ref<UserStats>(storageStats.read());

  const preferences = computed(() => user.value.preferences || {
    theme: 'dark',
    units: 'metric',
    notifications: true,
    soundEnabled: true
  });

  function updateUser(updates: Partial<User>) {
    user.value = { ...user.value, ...updates };
    storage.write(user.value);
  }

  function updatePreferences(newPreferences: Partial<UserPreferences>) {
    if (!user.value.preferences) {
      user.value.preferences = preferences.value;
    }
    user.value.preferences = { ...user.value.preferences, ...newPreferences };
    storage.write(user.value);
  }

  function updateStats(newStats: Partial<UserStats>) {
    stats.value = { ...stats.value, ...newStats };
    storageStats.write(stats.value);
  }

  function loadUserData() {
    user.value = storage.read();
    stats.value = storageStats.read();
  }

  return {
    user,
    stats,
    preferences,
    updateUser,
    updatePreferences,
    updateStats,
    loadUserData
  };
});

