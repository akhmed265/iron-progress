export type NutritionGoal = 'gain' | 'lose' | 'maintain';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type ProductCategory = 
  | 'grains'      // Крупы
  | 'fruits'      // Фрукты
  | 'vegetables'  // Овощи
  | 'protein'     // Белок (мясо, рыба, яйца)
  | 'dairy'       // Молочные продукты
  | 'nuts'        // Орехи и семена
  | 'beverages'   // Напитки
  | 'other';      // Другое

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  category: ProductCategory;
  calories: number;        // ккал на 100г
  protein: number;         // г на 100г
  fat: number;             // г на 100г
  carbs: number;           // г на 100г
  image?: string;          // путь к изображению
  description?: string;
}

export interface MealItem {
  productId: string;
  amount: number;          // граммы
  product?: Product;       // для быстрого доступа
}

export interface Meal {
  id: string;
  type: MealType;
  name: string;
  items: MealItem[];
  date: string;            // YYYY-MM-DD
  totalCalories?: number;
  totalProtein?: number;
  totalFat?: number;
  totalCarbs?: number;
}

export interface MealPlan {
  id: string;
  name: string;
  goal: NutritionGoal;
  meals: Omit<Meal, 'id' | 'date'>[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  isRecommended?: boolean;
  createdAt?: string;
}

export interface DailyNutrition {
  date: string;
  goal: NutritionGoal;
  targetCalories: number;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

export interface NutritionPreferences {
  goal: NutritionGoal;
  targetCalories?: number;
  activityLevel?: 'low' | 'moderate' | 'high';  // низкая, умеренная, высокая
  customMealPlanId?: string;
}

