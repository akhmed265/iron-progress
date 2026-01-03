import type { Product } from '@/types/nutrition.interface';

export const mockProducts: Product[] = [
  // Крупы
  {
    id: 'rice-1',
    name: 'Рис белый',
    category: 'grains',
    calories: 365,
    protein: 7,
    fat: 0.5,
    carbs: 80
  },
  {
    id: 'buckwheat-1',
    name: 'Гречка',
    category: 'grains',
    calories: 343,
    protein: 13,
    fat: 3.4,
    carbs: 72
  },
  {
    id: 'oatmeal-1',
    name: 'Овсянка',
    category: 'grains',
    calories: 389,
    protein: 17,
    fat: 7,
    carbs: 66
  },
  {
    id: 'bread-1',
    name: 'Хлеб белый',
    category: 'grains',
    calories: 266,
    protein: 8,
    fat: 3,
    carbs: 51
  },
  {
    id: 'bread-whole-1',
    name: 'Хлеб цельнозерновой',
    category: 'grains',
    calories: 247,
    protein: 13,
    fat: 4,
    carbs: 41
  },
  {
    id: 'pasta-1',
    name: 'Макароны',
    category: 'grains',
    calories: 371,
    protein: 10,
    fat: 1,
    carbs: 75
  },

  // Фрукты
  {
    id: 'apple-1',
    name: 'Яблоко',
    category: 'fruits',
    calories: 52,
    protein: 0.3,
    fat: 0.2,
    carbs: 14
  },
  {
    id: 'banana-1',
    name: 'Бананы',
    category: 'fruits',
    calories: 89,
    protein: 1,
    fat: 0.3,
    carbs: 23
  },
  {
    id: 'orange-1',
    name: 'Апельсин',
    category: 'fruits',
    calories: 47,
    protein: 0.9,
    fat: 0.1,
    carbs: 12
  },
  {
    id: 'berries-1',
    name: 'Ягоды (клубника, малина)',
    category: 'fruits',
    calories: 32,
    protein: 0.7,
    fat: 0.3,
    carbs: 8
  },

  // Овощи
  {
    id: 'broccoli-1',
    name: 'Брокколи',
    category: 'vegetables',
    calories: 34,
    protein: 2.8,
    fat: 0.4,
    carbs: 7
  },
  {
    id: 'carrot-1',
    name: 'Морковь',
    category: 'vegetables',
    calories: 41,
    protein: 0.9,
    fat: 0.2,
    carbs: 10
  },
  {
    id: 'cucumber-1',
    name: 'Огурец',
    category: 'vegetables',
    calories: 16,
    protein: 0.7,
    fat: 0.1,
    carbs: 4
  },
  {
    id: 'tomato-1',
    name: 'Помидор',
    category: 'vegetables',
    calories: 18,
    protein: 0.9,
    fat: 0.2,
    carbs: 4
  },

  // Белок
  {
    id: 'chicken-1',
    name: 'Куриная грудка',
    category: 'protein',
    calories: 165,
    protein: 31,
    fat: 3.6,
    carbs: 0
  },
  {
    id: 'beef-1',
    name: 'Говядина',
    category: 'protein',
    calories: 250,
    protein: 26,
    fat: 15,
    carbs: 0
  },
  {
    id: 'eggs-1',
    name: 'Яйца',
    category: 'protein',
    calories: 155,
    protein: 13,
    fat: 11,
    carbs: 1
  },
  {
    id: 'fish-1',
    name: 'Рыба (лосось)',
    category: 'protein',
    calories: 208,
    protein: 20,
    fat: 13,
    carbs: 0
  },
  {
    id: 'tofu-1',
    name: 'Тофу',
    category: 'protein',
    calories: 76,
    protein: 8,
    fat: 4.8,
    carbs: 1.9
  },

  // Молочные продукты
  {
    id: 'milk-1',
    name: 'Молоко',
    category: 'dairy',
    calories: 61,
    protein: 3.2,
    fat: 3.2,
    carbs: 4.7
  },
  {
    id: 'yogurt-1',
    name: 'Йогурт',
    category: 'dairy',
    calories: 59,
    protein: 10,
    fat: 0.4,
    carbs: 4
  },
  {
    id: 'cheese-1',
    name: 'Сыр',
    category: 'dairy',
    calories: 363,
    protein: 25,
    fat: 27,
    carbs: 2
  },
  {
    id: 'cottage-cheese-1',
    name: 'Творог',
    category: 'dairy',
    calories: 98,
    protein: 11,
    fat: 4,
    carbs: 3
  },

  // Орехи
  {
    id: 'almonds-1',
    name: 'Миндаль',
    category: 'nuts',
    calories: 579,
    protein: 21,
    fat: 50,
    carbs: 22
  },
  {
    id: 'peanuts-1',
    name: 'Арахис',
    category: 'nuts',
    calories: 567,
    protein: 26,
    fat: 49,
    carbs: 16
  },
  {
    id: 'walnuts-1',
    name: 'Грецкие орехи',
    category: 'nuts',
    calories: 654,
    protein: 15,
    fat: 65,
    carbs: 14
  }
];

