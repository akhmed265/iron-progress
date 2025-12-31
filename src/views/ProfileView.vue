<template>
  <div class="profile-view">
    <h1 class="page-title">Профиль</h1>

    <div class="profile-grid">
      <div class="profile-card">
        <h2 class="card-title">Личная информация</h2>
        <div class="profile-info">
          <div class="info-item">
            <label>Имя:</label>
            <input
              v-model="userName"
              type="text"
              class="info-input"
              @blur="updateName"
            />
          </div>
          <div class="info-item">
            <label>Вес (кг):</label>
            <input
              v-model.number="userWeight"
              type="number"
              class="info-input"
              @blur="updateWeight"
            />
          </div>
          <div class="info-item">
            <label>Рост (см):</label>
            <input
              v-model.number="userHeight"
              type="number"
              class="info-input"
              @blur="updateHeight"
            />
          </div>
        </div>
      </div>

      <div class="profile-card">
        <h2 class="card-title">Статистика</h2>
        <div class="stats-list">
          <div class="stat-row">
            <span class="stat-label">Всего тренировок:</span>
            <span class="stat-value">{{ userStore.stats.totalWorkouts }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Общий объем:</span>
            <span class="stat-value">{{ Math.round(userStore.stats.totalVolume) }} кг</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Серия дней:</span>
            <span class="stat-value">{{ userStore.stats.streakDays }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Последняя тренировка:</span>
            <span class="stat-value">
              {{ lastWorkoutDate || 'Нет данных' }}
            </span>
          </div>
        </div>
      </div>

      <div class="profile-card">
        <h2 class="card-title">Настройки</h2>
        <div class="settings-list">
          <div class="setting-item">
            <label class="setting-label">
              <input
                v-model="soundEnabled"
                type="checkbox"
                @change="updateSound"
              />
              <span>Звуковые уведомления</span>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <input
                v-model="notificationsEnabled"
                type="checkbox"
                @change="updateNotifications"
              />
              <span>Уведомления</span>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Тема</span>
              <div class="theme-toggle">
                <button
                  @click="setTheme('dark')"
                  class="theme-button"
                  :class="{ active: currentTheme === 'dark' }"
                >
                  🌙 Темная
                </button>
                <button
                  @click="setTheme('light')"
                  class="theme-button"
                  :class="{ active: currentTheme === 'light' }"
                >
                  ☀️ Светлая
                </button>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="profile-card">
        <h2 class="card-title">Данные</h2>
        <div class="data-actions">
          <BaseButton variant="outline" @click="exportData">
            Экспорт данных
          </BaseButton>
          <BaseButton variant="outline" @click="importData">
            Импорт данных
          </BaseButton>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          style="display: none"
          @change="handleFileImport"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import dayjs from 'dayjs';
import BaseButton from '@/components/shared/BaseButton.vue';

const userStore = useUserStore();
const workoutStore = useWorkoutStore();
const fileInput = ref<HTMLInputElement | null>(null);

const userName = ref(userStore.user.name || '');
const userWeight = ref(userStore.user.weight);
const userHeight = ref(userStore.user.height);
const soundEnabled = ref(userStore.preferences.value?.soundEnabled ?? true);
const notificationsEnabled = ref(userStore.preferences.value?.notifications ?? true);
const currentTheme = computed(() => userStore.preferences.value?.theme || 'dark');

const lastWorkoutDate = computed(() => {
  const lastWorkout = workoutStore.completedWorkouts
    .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))[0];
  return lastWorkout ? dayjs(lastWorkout.date).format('D MMMM YYYY') : null;
});

const updateName = () => {
  userStore.updateUser({ name: userName.value });
};

const updateWeight = () => {
  userStore.updateUser({ weight: userWeight.value });
};

const updateHeight = () => {
  userStore.updateUser({ height: userHeight.value });
};

const updateSound = () => {
  userStore.updatePreferences({ soundEnabled: soundEnabled.value });
};

const updateNotifications = () => {
  userStore.updatePreferences({ notifications: notificationsEnabled.value });
};

const setTheme = (theme: 'dark' | 'light') => {
  userStore.updatePreferences({ theme });
  document.documentElement.setAttribute('data-theme', theme);
};

const exportData = () => {
  const data = workoutStore.exportData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `iron-progress-export-${dayjs().format('YYYY-MM-DD')}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const importData = () => {
  fileInput.value?.click();
};

const handleFileImport = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      workoutStore.importData(data);
      alert('Данные успешно импортированы!');
    } catch (error) {
      alert('Ошибка при импорте данных');
      console.error(error);
    }
  };
  reader.readAsText(file);
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.profile-view {
  width: 100%;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-xl;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-lg;
}

.profile-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-xl;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.info-item label {
  font-size: 0.875rem;
  color: $text-secondary;
  font-weight: 500;
}

.info-input {
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  border: 2px solid $bg-tertiary;
  background: $bg-tertiary;
  color: $text-primary;
  font-size: 1rem;
  font-family: inherit;
  transition: all $transition-base;

  &:focus {
    outline: none;
    border-color: $accent-1;
    background: $bg-secondary;
  }
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: $spacing-sm 0;
  border-bottom: 1px solid $bg-tertiary;

  &:last-child {
    border-bottom: none;
  }
}

.stat-label {
  color: $text-secondary;
}

.stat-value {
  color: $text-primary;
  font-weight: 600;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.setting-item {
  padding: $spacing-sm 0;
}

.setting-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-sm;
  color: $text-primary;
  cursor: pointer;
  width: 100%;

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}

.data-actions {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

@media (max-width: $breakpoint-mobile) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

.theme-toggle {
  display: flex;
  gap: $spacing-xs;
  background: $bg-tertiary;
  border-radius: $radius-md;
  padding: 4px;
}

.theme-button {
  padding: $spacing-xs $spacing-md;
  background: transparent;
  border: none;
  border-radius: $radius-sm;
  color: $text-secondary;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    color: $text-primary;
    background: $bg-secondary;
  }

  &.active {
    background: $accent-1;
    color: $bg-primary;
    font-weight: 600;
  }
}
</style>

