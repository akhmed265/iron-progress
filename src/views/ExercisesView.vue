<template>
  <div class="exercises-view">
    <div class="exercises-header">
      <h1 class="page-title">Упражнения</h1>
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск упражнений..."
          class="search-input"
          @input="handleSearchInput"
          @focus="showSuggestions = true"
          @blur="hideSuggestions"
        />
        <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-dropdown">
          <div
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            class="suggestion-item"
            @mousedown="selectSuggestion(suggestion.name)"
          >
            <span class="suggestion-name">{{ suggestion.name }}</span>
            <span class="suggestion-muscle">{{ getMuscleGroupLabel(suggestion.muscleGroup[0]) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="exercises-layout">
      <aside class="filters-sidebar">
        <FilterPanel
          :selectedMuscleGroups="exerciseStore.selectedMuscleGroups"
          :selectedEquipment="exerciseStore.selectedEquipment"
          :selectedDifficulty="exerciseStore.selectedDifficulty"
          @update:selectedMuscleGroups="exerciseStore.setFilters({ muscleGroups: $event })"
          @update:selectedEquipment="exerciseStore.setFilters({ equipment: $event })"
          @update:selectedDifficulty="exerciseStore.setFilters({ difficulty: $event })"
        />
      </aside>

      <main class="exercises-content">
        <div class="exercises-stats">
          <p class="stats-text">
            Найдено упражнений: <strong>{{ filteredExercises.length }}</strong>
          </p>
        </div>

        <div class="exercises-grid">
          <ExerciseCard
            v-for="exercise in filteredExercises"
            :key="exercise.id"
            :exercise="exercise"
            @click="selectExercise(exercise)"
          />
        </div>

        <div v-if="filteredExercises.length === 0" class="no-exercises">
          <p>Не найдено упражнений по заданным фильтрам</p>
          <BaseButton variant="outline" @click="clearFilters">
            Очистить фильтры
          </BaseButton>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useExerciseStore } from '@/stores/useExerciseStore';
import ExerciseCard from '@/components/ui/ExerciseCard.vue';
import FilterPanel from '@/components/ui/FilterPanel.vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const exerciseStore = useExerciseStore();

const searchQuery = ref('');
const showSuggestions = ref(false);
const suggestions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return [];
  
  const query = searchQuery.value.toLowerCase();
  const matches = exerciseStore.exercises
    .filter(ex => 
      ex.name.toLowerCase().includes(query) ||
      ex.description.toLowerCase().includes(query)
    )
    .slice(0, 5); // Максимум 5 предложений
  
  return matches;
});

const filteredExercises = computed(() => {
  let result = exerciseStore.filteredExercises;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(ex =>
      ex.name.toLowerCase().includes(query) ||
      ex.description.toLowerCase().includes(query)
    );
  }

  return result;
});

watch(searchQuery, (newQuery) => {
  exerciseStore.setSearchQuery(newQuery);
});

const selectExercise = (exercise: any) => {
  // TODO: Открыть модальное окно с деталями упражнения
  console.log('Selected exercise', exercise);
};

const clearFilters = () => {
  exerciseStore.clearFilters();
  searchQuery.value = '';
};

const handleSearchInput = () => {
  showSuggestions.value = searchQuery.value.length >= 2;
};

const hideSuggestions = () => {
  // Задержка для обработки клика на предложение
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

const selectSuggestion = (name: string) => {
  searchQuery.value = name;
  showSuggestions.value = false;
};

const getMuscleGroupLabel = (group: string) => {
  const labels: Record<string, string> = {
    chest: 'Грудь',
    back: 'Спина',
    legs: 'Ноги',
    arms: 'Руки',
    shoulders: 'Плечи',
    core: 'Пресс'
  };
  return labels[group] || group;
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.exercises-view {
  width: 100%;
}

.exercises-header {
  margin-bottom: $spacing-xl;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.search-box {
  max-width: 400px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: $spacing-md;
  border-radius: $radius-md;
  border: 2px solid $bg-tertiary;
  background: $bg-secondary;
  color: $text-primary;
  font-size: 1rem;
  font-family: inherit;
  transition: all $transition-base;

  &:focus {
    outline: none;
    border-color: $accent-1;
  }

  &::placeholder {
    color: $text-secondary;
  }
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: $spacing-xs;
  background: $bg-secondary;
  border: 2px solid $bg-tertiary;
  border-radius: $radius-md;
  box-shadow: $shadow-lg;
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  cursor: pointer;
  transition: background $transition-base;
  border-bottom: 1px solid $bg-tertiary;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: $bg-tertiary;
  }
}

.suggestion-name {
  font-weight: 500;
  color: $text-primary;
}

.suggestion-muscle {
  font-size: 0.75rem;
  color: $text-secondary;
  padding: $spacing-xs $spacing-sm;
  background: $bg-tertiary;
  border-radius: $radius-sm;
}

.exercises-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: $spacing-lg;
}

.exercises-content {
  min-width: 0;
}

.exercises-stats {
  margin-bottom: $spacing-lg;
}

.stats-text {
  color: $text-secondary;

  strong {
    color: $text-primary;
    font-weight: 600;
  }
}

.exercises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
}

.no-exercises {
  text-align: center;
  padding: $spacing-2xl;
  background: $bg-secondary;
  border-radius: $radius-lg;
  color: $text-secondary;
}

@media (max-width: $breakpoint-tablet) {
  .exercises-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    order: 2;
  }

  .exercises-content {
    order: 1;
  }
}

@media (max-width: $breakpoint-mobile) {
  .exercises-grid {
    grid-template-columns: 1fr;
  }
}
</style>

