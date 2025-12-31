<template>
  <div class="filter-panel">
    <div class="filter-section">
      <h3 class="filter-title">Группы мышц</h3>
      <div class="filter-chips">
        <button
          v-for="group in muscleGroups"
          :key="group.value"
          @click="toggleMuscleGroup(group.value)"
          :class="['chip', { active: selectedMuscleGroups.includes(group.value) }]"
        >
          {{ group.label }}
        </button>
      </div>
    </div>

    <div class="filter-section">
      <h3 class="filter-title">Оборудование</h3>
      <div class="filter-chips">
        <button
          v-for="eq in equipment"
          :key="eq.value"
          @click="toggleEquipment(eq.value)"
          :class="['chip', { active: selectedEquipment.includes(eq.value) }]"
        >
          {{ eq.label }}
        </button>
      </div>
    </div>

    <div class="filter-section">
      <h3 class="filter-title">Сложность</h3>
      <div class="filter-chips">
        <button
          v-for="diff in difficulties"
          :key="diff.value"
          @click="toggleDifficulty(diff.value)"
          :class="['chip', { active: selectedDifficulty === diff.value }]"
        >
          {{ diff.label }}
        </button>
      </div>
    </div>

    <button class="clear-filters" @click="clearFilters" v-if="hasActiveFilters">
      Очистить фильтры
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MuscleGroup, Equipment, Difficulty } from '@/types/exercise.interface';

interface Props {
  selectedMuscleGroups: MuscleGroup[];
  selectedEquipment: Equipment[];
  selectedDifficulty: Difficulty | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:selectedMuscleGroups': [value: MuscleGroup[]];
  'update:selectedEquipment': [value: Equipment[]];
  'update:selectedDifficulty': [value: Difficulty | null];
}>();

const muscleGroups = [
  { value: 'chest' as MuscleGroup, label: 'Грудь' },
  { value: 'back' as MuscleGroup, label: 'Спина' },
  { value: 'legs' as MuscleGroup, label: 'Ноги' },
  { value: 'arms' as MuscleGroup, label: 'Руки' },
  { value: 'shoulders' as MuscleGroup, label: 'Плечи' },
  { value: 'core' as MuscleGroup, label: 'Пресс' }
];

const equipment = [
  { value: 'barbell' as Equipment, label: 'Штанга' },
  { value: 'dumbbell' as Equipment, label: 'Гантели' },
  { value: 'machine' as Equipment, label: 'Тренажер' },
  { value: 'bodyweight' as Equipment, label: 'Свой вес' },
  { value: 'kettlebell' as Equipment, label: 'Гиря' }
];

const difficulties = [
  { value: 'beginner' as Difficulty, label: 'Начальный' },
  { value: 'intermediate' as Difficulty, label: 'Средний' },
  { value: 'advanced' as Difficulty, label: 'Продвинутый' }
];

const hasActiveFilters = computed(() => {
  return props.selectedMuscleGroups.length > 0 ||
         props.selectedEquipment.length > 0 ||
         props.selectedDifficulty !== null;
});

const toggleMuscleGroup = (group: MuscleGroup) => {
  const newGroups = props.selectedMuscleGroups.includes(group)
    ? props.selectedMuscleGroups.filter(g => g !== group)
    : [...props.selectedMuscleGroups, group];
  emit('update:selectedMuscleGroups', newGroups);
};

const toggleEquipment = (eq: Equipment) => {
  const newEquipment = props.selectedEquipment.includes(eq)
    ? props.selectedEquipment.filter(e => e !== eq)
    : [...props.selectedEquipment, eq];
  emit('update:selectedEquipment', newEquipment);
};

const toggleDifficulty = (diff: Difficulty) => {
  const newDifficulty = props.selectedDifficulty === diff ? null : diff;
  emit('update:selectedDifficulty', newDifficulty);
};

const clearFilters = () => {
  emit('update:selectedMuscleGroups', []);
  emit('update:selectedEquipment', []);
  emit('update:selectedDifficulty', null);
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.filter-panel {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-lg;
}

.filter-section {
  margin-bottom: $spacing-lg;

  &:last-child {
    margin-bottom: 0;
  }
}

.filter-title {
  font-size: 1rem;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-md;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.chip {
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-full;
  border: 2px solid $bg-tertiary;
  background: transparent;
  color: $text-secondary;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    border-color: $accent-1;
    color: $accent-1;
  }

  &.active {
    background: $accent-1;
    border-color: $accent-1;
    color: $bg-primary;
  }
}

.clear-filters {
  margin-top: $spacing-lg;
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-md;
  border: 1px solid $bg-tertiary;
  background: transparent;
  color: $text-secondary;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all $transition-base;
  width: 100%;

  &:hover {
    border-color: $accent-2;
    color: $accent-2;
  }
}
</style>

