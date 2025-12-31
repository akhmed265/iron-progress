<template>
  <div class="muscle-group-progress">
    <h3 class="section-title">Прогресс по группам мышц</h3>
    <div class="muscle-groups-list">
      <div
        v-for="group in muscleGroups"
        :key="group.name"
        class="muscle-group-item"
      >
        <div class="muscle-group-header">
          <span class="muscle-group-name">{{ group.label }}</span>
          <span class="muscle-group-count">{{ group.count }} упражнений</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{
              width: `${group.percentage}%`,
              backgroundColor: group.color
            }"
          ></div>
        </div>
        <div class="muscle-group-footer">
          <span class="percentage">{{ Math.round(group.percentage) }}%</span>
        </div>
      </div>
    </div>
    <div v-if="muscleGroups.length === 0" class="empty-state">
      <p>Нет данных о тренировках</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MuscleGroup } from '@/types/exercise.interface';

interface MuscleGroupData {
  name: MuscleGroup;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

interface Props {
  muscleGroupData: Record<MuscleGroup, number>; // количество упражнений по группам
}

const props = defineProps<Props>();

const muscleGroupLabels: Record<MuscleGroup, string> = {
  chest: 'Грудь',
  back: 'Спина',
  legs: 'Ноги',
  arms: 'Руки',
  shoulders: 'Плечи',
  core: 'Пресс'
};

const muscleGroupColors: Record<MuscleGroup, string> = {
  chest: '#FF6B6B',
  back: '#00C896',
  legs: '#00A8FF',
  arms: '#FFD93D',
  shoulders: '#9D4EDD',
  core: '#FF9F43'
};

const maxCount = computed(() => {
  const counts = Object.values(props.muscleGroupData);
  return Math.max(...counts, 1);
});

const muscleGroups = computed<MuscleGroupData[]>(() => {
  return (Object.keys(muscleGroupLabels) as MuscleGroup[])
    .map(name => ({
      name,
      label: muscleGroupLabels[name],
      count: props.muscleGroupData[name] || 0,
      percentage: maxCount.value > 0 ? ((props.muscleGroupData[name] || 0) / maxCount.value) * 100 : 0,
      color: muscleGroupColors[name]
    }))
    .filter(group => group.count > 0)
    .sort((a, b) => b.count - a.count);
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.muscle-group-progress {
  width: 100%;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.muscle-groups-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.muscle-group-item {
  background: $bg-tertiary;
  border-radius: $radius-md;
  padding: $spacing-md;
}

.muscle-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
}

.muscle-group-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: $text-primary;
}

.muscle-group-count {
  font-size: 0.75rem;
  color: $text-secondary;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: $bg-secondary;
  border-radius: $radius-full;
  overflow: hidden;
  margin-bottom: $spacing-xs;
}

.progress-fill {
  height: 100%;
  border-radius: $radius-full;
  transition: width $transition-base;
}

.muscle-group-footer {
  display: flex;
  justify-content: flex-end;
}

.percentage {
  font-size: 0.75rem;
  color: $text-secondary;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: $spacing-xl;
  color: $text-secondary;
}
</style>

