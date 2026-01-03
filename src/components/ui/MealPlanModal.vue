<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="handleClose">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">{{ editingPlan ? 'Редактировать план' : 'Создать план питания' }}</h2>
            <button class="modal-close" @click="handleClose">✕</button>
          </div>

          <form @submit.prevent="handleSubmit" class="modal-body">
            <div class="form-group">
              <label class="form-label">Название плана</label>
              <input
                v-model="formData.name"
                type="text"
                class="form-input"
                placeholder="Мой план питания"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Цель</label>
              <select v-model="formData.goal" class="form-select" required>
                <option value="gain">Набор веса</option>
                <option value="lose">Сброс веса</option>
                <option value="maintain">Поддержание</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Приемы пищи</label>
              <div class="meals-list">
                <div
                  v-for="(meal, index) in formData.meals"
                  :key="index"
                  class="meal-item"
                >
                  <div class="meal-header">
                    <select v-model="meal.type" class="form-select form-select--small" required>
                      <option value="breakfast">Завтрак</option>
                      <option value="lunch">Обед</option>
                      <option value="dinner">Ужин</option>
                      <option value="snack">Перекус</option>
                    </select>
                    <input
                      v-model="meal.name"
                      type="text"
                      class="form-input form-input--small"
                      placeholder="Название"
                      required
                    />
                    <button
                      type="button"
                      class="btn-remove"
                      @click="removeMeal(index)"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div class="meal-items">
                    <div
                      v-for="(item, itemIndex) in meal.items"
                      :key="itemIndex"
                      class="meal-item-row"
                    >
                      <select
                        v-model="item.productId"
                        class="form-select form-select--small"
                        required
                      >
                        <option value="">Выберите продукт</option>
                        <option
                          v-for="product in products"
                          :key="product.id"
                          :value="product.id"
                        >
                          {{ product.name }}
                        </option>
                      </select>
                      <input
                        v-model.number="item.amount"
                        type="number"
                        class="form-input form-input--small"
                        placeholder="граммы"
                        min="1"
                        step="1"
                        required
                      />
                      <button
                        type="button"
                        class="btn-remove"
                        @click="removeMealItem(index, itemIndex)"
                      >
                        ✕
                      </button>
                    </div>
                    <button
                      type="button"
                      class="btn-add"
                      @click="addMealItem(index)"
                    >
                      + Добавить продукт
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  class="btn-add btn-add--meal"
                  @click="addMeal"
                >
                  + Добавить прием пищи
                </button>
              </div>
            </div>

            <div class="modal-actions">
              <BaseButton variant="outline" @click="handleClose" type="button">
                Отмена
              </BaseButton>
              <BaseButton variant="primary" type="submit">
                {{ editingPlan ? 'Сохранить' : 'Создать' }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useNutritionStore } from '@/stores/useNutritionStore';
import BaseButton from '@/components/shared/BaseButton.vue';
import type { MealPlan, MealType, MealItem } from '@/types/nutrition.interface';

interface Props {
  show: boolean;
  editingPlan?: MealPlan | null;
}

const props = withDefaults(defineProps<Props>(), {
  editingPlan: null
});

const emit = defineEmits<{
  close: [];
  save: [plan: Omit<MealPlan, 'id' | 'totalCalories' | 'totalProtein' | 'totalFat' | 'totalCarbs'>];
}>();

const nutritionStore = useNutritionStore();
const products = computed(() => nutritionStore.products);

const formData = ref<{
  name: string;
  goal: 'gain' | 'lose' | 'maintain';
  meals: Array<{
    type: MealType;
    name: string;
    items: MealItem[];
  }>;
}>({
  name: '',
  goal: 'maintain',
  meals: [
    {
      type: 'breakfast',
      name: 'Завтрак',
      items: [{ productId: '', amount: 100 }]
    }
  ]
});

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.editingPlan) {
      formData.value = {
        name: props.editingPlan.name,
        goal: props.editingPlan.goal,
        meals: props.editingPlan.meals.map(meal => ({
          type: meal.type,
          name: meal.name,
          items: meal.items.map(item => ({
            productId: item.productId,
            amount: item.amount
          }))
        }))
      };
    } else {
      resetForm();
    }
  }
});

function resetForm() {
  formData.value = {
    name: '',
    goal: 'maintain',
    meals: [
      {
        type: 'breakfast',
        name: 'Завтрак',
        items: [{ productId: '', amount: 100 }]
      }
    ]
  };
}

function addMeal() {
  formData.value.meals.push({
    type: 'lunch',
    name: 'Обед',
    items: [{ productId: '', amount: 100 }]
  });
}

function removeMeal(index: number) {
  formData.value.meals.splice(index, 1);
}

function addMealItem(mealIndex: number) {
  formData.value.meals[mealIndex].items.push({
    productId: '',
    amount: 100
  });
}

function removeMealItem(mealIndex: number, itemIndex: number) {
  formData.value.meals[mealIndex].items.splice(itemIndex, 1);
}

function handleSubmit() {
  emit('save', formData.value);
  handleClose();
}

function handleClose() {
  emit('close');
  resetForm();
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-md;
}

.modal-content {
  background: $bg-secondary;
  border-radius: $radius-lg;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
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
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  color: $text-secondary;
  font-size: 1.5rem;
  cursor: pointer;
  padding: $spacing-xs;
  line-height: 1;
  transition: color $transition-base;

  &:hover {
    color: $text-primary;
  }
}

.modal-body {
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

  &--small {
    padding: $spacing-sm;
    font-size: 0.875rem;
  }
}

.meals-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.meal-item {
  padding: $spacing-md;
  background: $bg-tertiary;
  border-radius: $radius-md;
}

.meal-header {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
  align-items: center;

  .form-select--small {
    flex: 0 0 120px;
  }

  .form-input--small {
    flex: 1;
  }
}

.meal-items {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.meal-item-row {
  display: flex;
  gap: $spacing-sm;
  align-items: center;

  .form-select--small {
    flex: 1;
  }

  .form-input--small {
    flex: 0 0 100px;
  }
}

.btn-remove {
  background: $accent-2;
  border: none;
  color: $bg-primary;
  width: 32px;
  height: 32px;
  border-radius: $radius-sm;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-base;

  &:hover {
    background: darken($accent-2, 10%);
  }
}

.btn-add {
  background: transparent;
  border: 2px dashed $bg-tertiary;
  color: $text-secondary;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all $transition-base;

  &:hover {
    border-color: $accent-1;
    color: $accent-1;
  }

  &--meal {
    margin-top: $spacing-sm;
  }
}

.modal-actions {
  display: flex;
  gap: $spacing-md;
  justify-content: flex-end;
  margin-top: $spacing-xl;
  padding-top: $spacing-lg;
  border-top: 1px solid $bg-tertiary;
}

/* Transition анимации */
.modal-enter-active,
.modal-leave-active {
  transition: opacity $transition-base;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform $transition-base, opacity $transition-base;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
  opacity: 0;
}
</style>

