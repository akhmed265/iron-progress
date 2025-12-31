<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">Новая цель</h2>
            <button class="modal-close" @click="handleClose">×</button>
          </div>

          <div class="modal-content">
            <div class="form-group">
              <label class="form-label">Тип цели</label>
              <select v-model="formData.type" class="form-select">
                <option value="workouts_per_month">Тренировок в месяц</option>
                <option value="workouts_per_week">Тренировок в неделю</option>
                <option value="volume_per_month">Объем в месяц (кг)</option>
                <option value="streak_days">Дней подряд</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Целевое значение</label>
              <input
                v-model.number="formData.target"
                type="number"
                min="1"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Дедлайн (необязательно)</label>
              <input
                v-model="formData.deadline"
                type="date"
                class="form-input"
              />
            </div>
          </div>

          <div class="modal-footer">
            <BaseButton variant="outline" @click="handleClose">Отмена</BaseButton>
            <BaseButton variant="primary" @click="handleSave" :disabled="!canSave">
              Создать
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Goal } from '@/types/goal.interface';
import BaseButton from '@/components/shared/BaseButton.vue';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  save: [goal: Omit<Goal, 'id' | 'current' | 'completed' | 'createdAt'>];
}>();

const formData = ref({
  type: 'workouts_per_month' as Goal['type'],
  target: 10,
  period: 'month' as 'month' | 'week' | 'all',
  deadline: undefined as string | undefined
});

const canSave = computed(() => {
  return formData.value.target > 0;
});

const handleSave = () => {
  if (!canSave.value) return;
  
  emit('save', {
    type: formData.value.type,
    target: formData.value.target,
    period: formData.value.period,
    deadline: formData.value.deadline
  });
  
  // Сброс формы
  formData.value = {
    type: 'workouts_per_month',
    target: 10,
    period: 'month',
    deadline: undefined
  };
  
  handleClose();
};

const handleClose = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: $spacing-md;
}

.modal-container {
  background: $bg-secondary;
  border-radius: $radius-lg;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  box-shadow: $shadow-lg;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 1px solid $bg-tertiary;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: $text-primary;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: $radius-md;
  border: none;
  background: transparent;
  color: $text-secondary;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-base;

  &:hover {
    background: $bg-tertiary;
    color: $text-primary;
  }
}

.modal-content {
  padding: $spacing-lg;
}

.form-group {
  margin-bottom: $spacing-lg;
}

.form-label {
  display: block;
  margin-bottom: $spacing-sm;
  color: $text-primary;
  font-weight: 500;
}

.form-input,
.form-select {
  width: 100%;
  padding: $spacing-md;
  border-radius: $radius-md;
  border: 2px solid $bg-tertiary;
  background: $bg-primary;
  color: $text-primary;
  font-size: 1rem;
  font-family: inherit;
  transition: all $transition-base;

  &:focus {
    outline: none;
    border-color: $accent-1;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-md;
  padding: $spacing-lg;
  border-top: 1px solid $bg-tertiary;
}
</style>

