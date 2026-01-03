import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import type { 
  Product, 
  Meal, 
  MealPlan, 
  DailyNutrition, 
  NutritionGoal,
  MealItem,
  ProductCategory
} from '@/types/nutrition.interface';
import { mockProducts } from '@/assets/data/products';
import { recommendedMealPlans as defaultRecommendedMealPlans } from '@/assets/data/recommendedMealPlans';
import { useLocalStorage } from '@/composables/useLocalStorage';

export const useNutritionStore = defineStore('nutrition', () => {
  const productsStorage = useLocalStorage<Product[]>('iron-progress-products', mockProducts);
  const mealsStorage = useLocalStorage<Meal[]>('iron-progress-meals', []);
  const mealPlansStorage = useLocalStorage<MealPlan[]>('iron-progress-meal-plans', []);
  const preferencesStorage = useLocalStorage<{ goal: NutritionGoal | null; targetCalories?: number }>('iron-progress-nutrition-preferences', {
    goal: null
  });

  const products = ref<Product[]>(productsStorage.read());
  const meals = ref<Meal[]>(mealsStorage.read());
  const mealPlans = ref<MealPlan[]>(mealPlansStorage.read());
  const preferences = ref(preferencesStorage.read());

  // Вспомогательная функция для вычисления БЖУ плана
  function calculateMealMacrosForPlan(meals: Omit<Meal, 'id' | 'date'>[]) {
    let calories = 0;
    let protein = 0;
    let fat = 0;
    let carbs = 0;

    meals.forEach(meal => {
      meal.items.forEach(item => {
        const product = products.value.find(p => p.id === item.productId);
        if (product) {
          const multiplier = item.amount / 100;
          calories += product.calories * multiplier;
          protein += product.protein * multiplier;
          fat += product.fat * multiplier;
          carbs += product.carbs * multiplier;
        }
      });
    });

    return { calories, protein, fat, carbs };
  }

  // Инициализация рекомендуемых планов при первом запуске
  function initializeRecommendedPlans() {
    if (mealPlans.value.length === 0 || !mealPlans.value.some(p => p.isRecommended)) {
      defaultRecommendedMealPlans.forEach(planTemplate => {
        const macros = calculateMealMacrosForPlan(planTemplate.meals);
        const plan: MealPlan = {
          ...planTemplate,
          id: `recommended-${planTemplate.goal}-${planTemplate.name}`,
          totalCalories: Math.round(macros.calories),
          totalProtein: Math.round(macros.protein * 10) / 10,
          totalFat: Math.round(macros.fat * 10) / 10,
          totalCarbs: Math.round(macros.carbs * 10) / 10,
          createdAt: dayjs().toISOString()
        };
        mealPlans.value.push(plan);
      });
      mealPlansStorage.write(mealPlans.value);
    }
  }

  // Рекомендуемые планы питания
  const recommendedMealPlans = computed(() => {
    return mealPlans.value.filter(plan => plan.isRecommended);
  });

  // Пользовательские планы
  const customMealPlans = computed(() => {
    return mealPlans.value.filter(plan => !plan.isRecommended);
  });

  // Питание за сегодня
  const todayNutrition = computed((): DailyNutrition => {
    const today = dayjs().format('YYYY-MM-DD');
    const todayMeals = meals.value.filter(m => m.date === today);
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    todayMeals.forEach(meal => {
      totalCalories += meal.totalCalories || 0;
      totalProtein += meal.totalProtein || 0;
      totalFat += meal.totalFat || 0;
      totalCarbs += meal.totalCarbs || 0;
    });

    return {
      date: today,
      goal: preferences.value.goal || 'maintain',
      targetCalories: preferences.value.targetCalories || 2000,
      meals: todayMeals,
      totalCalories,
      totalProtein,
      totalFat,
      totalCarbs
    };
  });

  // Продукты по категориям
  function getProductsByCategory(category: ProductCategory): Product[] {
    return products.value.filter(p => p.category === category);
  }

  // Поиск продукта
  function searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return products.value.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.nameEn?.toLowerCase().includes(lowerQuery)
    );
  }

  // Добавить продукт
  function addProduct(product: Omit<Product, 'id'>) {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    products.value.push(newProduct);
    productsStorage.write(products.value);
    return newProduct;
  }

  // Вычислить БЖУ для блюда
  function calculateMealMacros(items: MealItem[]): {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  } {
    let calories = 0;
    let protein = 0;
    let fat = 0;
    let carbs = 0;

    items.forEach(item => {
      const product = products.value.find(p => p.id === item.productId);
      if (product) {
        const multiplier = item.amount / 100; // переводим граммы в коэффициент
        calories += product.calories * multiplier;
        protein += product.protein * multiplier;
        fat += product.fat * multiplier;
        carbs += product.carbs * multiplier;
      }
    });

    return {
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      carbs: Math.round(carbs * 10) / 10
    };
  }

  // Добавить прием пищи
  function addMeal(meal: Omit<Meal, 'id' | 'totalCalories' | 'totalProtein' | 'totalFat' | 'totalCarbs'>) {
    const macros = calculateMealMacros(meal.items);
    const newMeal: Meal = {
      ...meal,
      id: `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      totalCalories: macros.calories,
      totalProtein: macros.protein,
      totalFat: macros.fat,
      totalCarbs: macros.carbs,
      items: meal.items.map(item => ({
        ...item,
        product: products.value.find(p => p.id === item.productId)
      }))
    };
    meals.value.push(newMeal);
    mealsStorage.write(meals.value);
    return newMeal;
  }

  // Удалить прием пищи
  function deleteMeal(id: string) {
    meals.value = meals.value.filter(m => m.id !== id);
    mealsStorage.write(meals.value);
  }

  // Сохранить план питания
  function saveMealPlan(plan: Omit<MealPlan, 'id' | 'totalCalories' | 'totalProtein' | 'totalFat' | 'totalCarbs'>) {
    // Вычисляем общие БЖУ для плана
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    plan.meals.forEach(mealTemplate => {
      const macros = calculateMealMacros(mealTemplate.items);
      totalCalories += macros.calories;
      totalProtein += macros.protein;
      totalFat += macros.fat;
      totalCarbs += macros.carbs;
    });

    const newPlan: MealPlan = {
      ...plan,
      id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalFat: Math.round(totalFat * 10) / 10,
      totalCarbs: Math.round(totalCarbs * 10) / 10,
      createdAt: dayjs().toISOString()
    };

    mealPlans.value.push(newPlan);
    mealPlansStorage.write(mealPlans.value);
    return newPlan;
  }

  // Удалить план питания
  function deleteMealPlan(id: string) {
    mealPlans.value = mealPlans.value.filter(p => p.id !== id);
    mealPlansStorage.write(mealPlans.value);
  }

  // Установить цель питания
  function setNutritionGoal(goal: NutritionGoal, targetCalories?: number) {
    preferences.value.goal = goal;
    if (targetCalories !== undefined) {
      preferences.value.targetCalories = targetCalories;
    }
    preferencesStorage.write(preferences.value);
  }

  // Загрузить данные
  function loadNutritionData() {
    products.value = productsStorage.read();
    meals.value = mealsStorage.read();
    mealPlans.value = mealPlansStorage.read();
    preferences.value = preferencesStorage.read();
    initializeRecommendedPlans();
  }

  // Очистить цель питания
  function clearNutritionGoal() {
    preferences.value.goal = null;
    preferencesStorage.write(preferences.value);
  }

  return {
    products,
    meals,
    mealPlans,
    preferences,
    recommendedMealPlans,
    customMealPlans,
    todayNutrition,
    getProductsByCategory,
    searchProducts,
    addProduct,
    addMeal,
    deleteMeal,
    saveMealPlan,
    deleteMealPlan,
    setNutritionGoal,
    clearNutritionGoal,
    calculateMealMacros,
    loadNutritionData
  };
});

