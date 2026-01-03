<template>
  <div class="nutrition-view">
    <h1 class="page-title">Питание</h1>

    <!-- Выбор цели -->
    <div v-if="!hasGoal" class="goal-selection-section">
      <NutritionGoalSelector 
        v-model="selectedGoal"
        @update:modelValue="handleGoalSelect"
      />
      <div v-if="selectedGoal" class="calories-input-section">
        <label class="input-label">
          Целевое количество калорий в день
          <input 
            type="number" 
            v-model.number="targetCalories"
            class="calories-input"
            placeholder="2000"
            min="1200"
            max="5000"
          />
        </label>
        <BaseButton variant="primary" @click="saveGoal">
          Сохранить
        </BaseButton>
      </div>
    </div>

    <!-- Основной контент -->
    <div v-else class="nutrition-content">
      <!-- Статистика за сегодня -->
      <div class="today-stats-card">
        <h2 class="section-title">Сегодня</h2>
        <div class="stats-macros">
          <div class="stat-item">
            <span class="stat-value">{{ todayNutrition.totalCalories }}</span>
            <span class="stat-label">из {{ todayNutrition.targetCalories }} ккал</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ todayNutrition.totalProtein }}г</span>
            <span class="stat-label">Белки</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ todayNutrition.totalFat }}г</span>
            <span class="stat-label">Жиры</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ todayNutrition.totalCarbs }}г</span>
            <span class="stat-label">Углеводы</span>
          </div>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${caloriesProgress}%` }"
          ></div>
        </div>
        <BaseButton variant="outline" size="small" @click="changeGoal">
          Изменить цель
        </BaseButton>
      </div>

      <!-- Рекомендуемые планы -->
      <div class="meal-plans-section">
        <div class="section-header">
          <h2 class="section-title">Рекомендуемые планы</h2>
          <BaseButton variant="outline" size="small" @click="showCreateModal = true">
            Создать свой план
          </BaseButton>
        </div>
        
        <div v-if="recommendedPlans.length > 0" class="meal-plans-grid">
          <MealPlanCard
            v-for="plan in recommendedPlans"
            :key="plan.id"
            :plan="plan"
            :show-delete="false"
            @use="handleUsePlan"
          />
        </div>
        <div v-else class="empty-state">
          <p>Нет рекомендуемых планов</p>
        </div>
      </div>

      <!-- Мои планы -->
      <div v-if="customPlans.length > 0" class="meal-plans-section">
        <h2 class="section-title">Мои планы</h2>
        <div class="meal-plans-grid">
          <MealPlanCard
            v-for="plan in customPlans"
            :key="plan.id"
            :plan="plan"
            @use="handleUsePlan"
            @edit="handleEditPlan"
            @delete="handleDeletePlan"
          />
        </div>
      </div>

      <!-- Продукты -->
      <div class="products-section">
        <div class="section-header">
          <h2 class="section-title">Продукты</h2>
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск продуктов..."
              class="search-input"
            />
          </div>
        </div>

        <!-- Фильтр по категориям -->
        <div class="category-filters">
          <button
            v-for="category in categories"
            :key="category.value"
            class="category-filter"
            :class="{ active: selectedCategory === category.value }"
            @click="selectedCategory = category.value"
          >
            {{ category.label }}
          </button>
        </div>

        <!-- Список продуктов -->
        <div v-if="filteredProducts.length > 0" class="products-grid">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @click="selectProduct(product)"
          />
        </div>
        <div v-else class="empty-state">
          <p>Продукты не найдены</p>
          <p class="empty-state-hint">Попробуйте изменить фильтр или очистить поиск</p>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания/редактирования плана -->
    <MealPlanModal
      :show="showCreateModal"
      :editing-plan="editingPlan"
      @close="showCreateModal = false; editingPlan = null; isEditingRecommendedPlan = false"
      @save="handleSaveMealPlan"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNutritionStore } from '@/stores/useNutritionStore';
import { useToast } from '@/composables/useToast';
import NutritionGoalSelector from '@/components/ui/NutritionGoalSelector.vue';
import MealPlanCard from '@/components/ui/MealPlanCard.vue';
import ProductCard from '@/components/ui/ProductCard.vue';
import MealPlanModal from '@/components/ui/MealPlanModal.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import type { NutritionGoal, ProductCategory, MealPlan, Product } from '@/types/nutrition.interface';

const nutritionStore = useNutritionStore();
const toast = useToast();

const selectedGoal = ref<NutritionGoal>(nutritionStore.preferences.goal || 'maintain');
const targetCalories = ref<number>(nutritionStore.preferences.targetCalories || 2000);
const searchQuery = ref('');
const selectedCategory = ref<ProductCategory | 'all'>('all');
const showCreateModal = ref(false);
const editingPlan = ref<MealPlan | null>(null);
const isEditingRecommendedPlan = ref(false);

const hasGoal = computed(() => !!nutritionStore.preferences.goal);
const todayNutrition = computed(() => nutritionStore.todayNutrition);
const recommendedPlans = computed(() => nutritionStore.recommendedMealPlans);
const customPlans = computed(() => nutritionStore.customMealPlans);

const caloriesProgress = computed(() => {
  if (todayNutrition.value.targetCalories === 0) return 0;
  const progress = (todayNutrition.value.totalCalories / todayNutrition.value.targetCalories) * 100;
  return Math.min(progress, 100);
});

const categories = [
  { value: 'all' as const, label: 'Все' },
  { value: 'grains' as ProductCategory, label: 'Крупы' },
  { value: 'fruits' as ProductCategory, label: 'Фрукты' },
  { value: 'vegetables' as ProductCategory, label: 'Овощи' },
  { value: 'protein' as ProductCategory, label: 'Белок' },
  { value: 'dairy' as ProductCategory, label: 'Молочные' },
  { value: 'nuts' as ProductCategory, label: 'Орехи' },
  { value: 'beverages' as ProductCategory, label: 'Напитки' },
  { value: 'other' as ProductCategory, label: 'Другое' }
];

const filteredProducts = computed(() => {
  let products = nutritionStore.products;

  // Фильтр по категории
  if (selectedCategory.value !== 'all') {
    products = nutritionStore.getProductsByCategory(selectedCategory.value);
  }

  // Поиск (применяется к уже отфильтрованным продуктам)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.nameEn?.toLowerCase().includes(query)
    );
  }

  return products;
});

function handleGoalSelect(goal: NutritionGoal) {
  selectedGoal.value = goal;
  // Предустановленные калории по цели
  if (!targetCalories.value) {
    targetCalories.value = goal === 'gain' ? 2500 : goal === 'lose' ? 1800 : 2000;
  }
}

function saveGoal() {
  nutritionStore.setNutritionGoal(selectedGoal.value, targetCalories.value);
  toast.success('Цель питания сохранена!', 3000);
}

function changeGoal() {
  nutritionStore.clearNutritionGoal();
}

function handleEditPlan(plan: MealPlan) {
  editingPlan.value = plan;
  isEditingRecommendedPlan.value = false;
  showCreateModal.value = true;
}

function handleUsePlan(plan: MealPlan) {
  // Если это рекомендуемый план, открываем модальное окно для редактирования
  if (plan.isRecommended) {
    // Создаем копию плана без флага isRecommended для редактирования
    editingPlan.value = {
      ...plan,
      isRecommended: false
    };
    isEditingRecommendedPlan.value = true;
    showCreateModal.value = true;
  } else {
    // Для пользовательских планов можно добавить другую логику (например, применение на сегодня)
    toast.success(`План "${plan.name}" применен`, 3000);
  }
}

function handleDeletePlan(id: string) {
  nutritionStore.deleteMealPlan(id);
  toast.info('План удален', 2000);
}

function handleSaveMealPlan(planData: Omit<MealPlan, 'id' | 'totalCalories' | 'totalProtein' | 'totalFat' | 'totalCarbs'>) {
  if (editingPlan.value) {
    if (isEditingRecommendedPlan.value) {
      // Если редактируем рекомендуемый план, создаем новый пользовательский план
      // (не удаляем оригинальный рекомендуемый план)
      const userPlanData = {
        ...planData,
        isRecommended: false // Убираем флаг recommended
      };
      nutritionStore.saveMealPlan(userPlanData);
      toast.success('План добавлен в "Мои планы"!', 3000);
      isEditingRecommendedPlan.value = false;
    } else {
      // Редактирование пользовательского плана - удаляем старый и создаем новый
      nutritionStore.deleteMealPlan(editingPlan.value.id);
      nutritionStore.saveMealPlan(planData);
      toast.success('План обновлен', 3000);
    }
  } else {
    // Создание нового плана
    nutritionStore.saveMealPlan(planData);
    toast.success('План создан!', 3000);
  }
  showCreateModal.value = false;
  editingPlan.value = null;
}

function selectProduct(product: Product) {
  // Здесь можно открыть модальное окно для добавления продукта в прием пищи
  console.log('Selected product:', product);
}

onMounted(() => {
  nutritionStore.loadNutritionData();
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.nutrition-view {
  width: 100%;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-xl;
}

.goal-selection-section {
  margin-bottom: $spacing-xl;
}

.calories-input-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  margin-top: $spacing-lg;
  padding: $spacing-lg;
  background: $bg-secondary;
  border-radius: $radius-lg;
}

.input-label {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  color: $text-primary;
  font-weight: 500;
}

.calories-input {
  padding: $spacing-md;
  border-radius: $radius-md;
  border: 2px solid $bg-tertiary;
  background: $bg-primary;
  color: $text-primary;
  font-size: 1rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: $accent-1;
  }
}

.nutrition-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.today-stats-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-xl;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.stats-macros {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-md;
  background: $bg-tertiary;
  border-radius: $radius-md;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: $accent-1;
  margin-bottom: $spacing-xs;
}

.stat-label {
  font-size: 0.875rem;
  color: $text-secondary;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: $bg-tertiary;
  border-radius: $radius-full;
  overflow: hidden;
  margin-bottom: $spacing-md;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $accent-1, $accent-3);
  transition: width $transition-base;
}

.meal-plans-section {
  margin-bottom: $spacing-xl;
}

.meal-plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
}

.empty-state {
  text-align: center;
  padding: $spacing-2xl;
  background: $bg-secondary;
  border-radius: $radius-lg;
  color: $text-secondary;
}

.products-section {
  margin-bottom: $spacing-xl;
}

.search-box {
  max-width: 300px;
  width: 100%;
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

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;
}

.category-filter {
  padding: $spacing-sm $spacing-md;
  background: $bg-secondary;
  border: 2px solid $bg-tertiary;
  border-radius: $radius-full;
  color: $text-primary;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    border-color: $accent-1;
  }

  &.active {
    background: $accent-1;
    border-color: $accent-1;
    color: $bg-primary;
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-md;
}

@media (max-width: $breakpoint-tablet) {
  .meal-plans-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (max-width: $breakpoint-mobile) {
  .stats-macros {
    grid-template-columns: repeat(2, 1fr);
  }

  .meal-plans-grid,
  .products-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-box {
    max-width: 100%;
  }
}
</style>

