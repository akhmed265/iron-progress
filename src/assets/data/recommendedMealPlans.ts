import type { MealPlan, MealType } from '@/types/nutrition.interface';

export const recommendedMealPlans: Omit<MealPlan, 'id' | 'totalCalories' | 'totalProtein' | 'totalFat' | 'totalCarbs'>[] = [
  {
    name: 'План для набора веса',
    goal: 'gain',
    isRecommended: true,
    meals: [
      {
        type: 'breakfast' as MealType,
        name: 'Завтрак',
        items: [
          { productId: 'oatmeal-1', amount: 100 },
          { productId: 'banana-1', amount: 150 },
          { productId: 'eggs-1', amount: 200 }
        ]
      },
      {
        type: 'lunch' as MealType,
        name: 'Обед',
        items: [
          { productId: 'rice-1', amount: 150 },
          { productId: 'chicken-1', amount: 200 },
          { productId: 'broccoli-1', amount: 150 }
        ]
      },
      {
        type: 'dinner' as MealType,
        name: 'Ужин',
        items: [
          { productId: 'pasta-1', amount: 150 },
          { productId: 'beef-1', amount: 150 },
          { productId: 'tomato-1', amount: 100 }
        ]
      },
      {
        type: 'snack' as MealType,
        name: 'Перекус',
        items: [
          { productId: 'almonds-1', amount: 50 },
          { productId: 'yogurt-1', amount: 200 }
        ]
      }
    ]
  },
  {
    name: 'План для сброса веса',
    goal: 'lose',
    isRecommended: true,
    meals: [
      {
        type: 'breakfast' as MealType,
        name: 'Завтрак',
        items: [
          { productId: 'cottage-cheese-1', amount: 150 },
          { productId: 'apple-1', amount: 150 },
          { productId: 'almonds-1', amount: 30 }
        ]
      },
      {
        type: 'lunch' as MealType,
        name: 'Обед',
        items: [
          { productId: 'buckwheat-1', amount: 100 },
          { productId: 'chicken-1', amount: 150 },
          { productId: 'cucumber-1', amount: 150 },
          { productId: 'tomato-1', amount: 100 }
        ]
      },
      {
        type: 'dinner' as MealType,
        name: 'Ужин',
        items: [
          { productId: 'fish-1', amount: 150 },
          { productId: 'broccoli-1', amount: 200 },
          { productId: 'carrot-1', amount: 100 }
        ]
      },
      {
        type: 'snack' as MealType,
        name: 'Перекус',
        items: [
          { productId: 'berries-1', amount: 150 },
          { productId: 'yogurt-1', amount: 100 }
        ]
      }
    ]
  },
  {
    name: 'План для поддержания',
    goal: 'maintain',
    isRecommended: true,
    meals: [
      {
        type: 'breakfast' as MealType,
        name: 'Завтрак',
        items: [
          { productId: 'oatmeal-1', amount: 80 },
          { productId: 'banana-1', amount: 100 },
          { productId: 'milk-1', amount: 200 }
        ]
      },
      {
        type: 'lunch' as MealType,
        name: 'Обед',
        items: [
          { productId: 'rice-1', amount: 120 },
          { productId: 'chicken-1', amount: 150 },
          { productId: 'tomato-1', amount: 150 }
        ]
      },
      {
        type: 'dinner' as MealType,
        name: 'Ужин',
        items: [
          { productId: 'buckwheat-1', amount: 100 },
          { productId: 'fish-1', amount: 150 },
          { productId: 'broccoli-1', amount: 150 }
        ]
      },
      {
        type: 'snack' as MealType,
        name: 'Перекус',
        items: [
          { productId: 'apple-1', amount: 150 },
          { productId: 'walnuts-1', amount: 30 }
        ]
      }
    ]
  }
];

