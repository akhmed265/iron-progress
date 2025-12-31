import type { Exercise } from '@/types/exercise.interface';

export const mockExercises: Exercise[] = [
  // Chest
  {
    id: 'ex1',
    name: 'Жим штанги лежа',
    muscleGroup: ['chest'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'Базовое упражнение для развития грудных мышц'
  },
  {
    id: 'ex2',
    name: 'Жим гантелей лежа',
    muscleGroup: ['chest'],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    description: 'Альтернатива жиму штанги с большей амплитудой'
  },
  {
    id: 'ex3',
    name: 'Отжимания',
    muscleGroup: ['chest', 'arms'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    description: 'Классические отжимания от пола'
  },
  {
    id: 'ex4',
    name: 'Разводка гантелей',
    muscleGroup: ['chest'],
    equipment: ['dumbbell'],
    difficulty: 'intermediate',
    description: 'Изолирующее упражнение для грудных мышц'
  },
  
  // Back
  {
    id: 'ex5',
    name: 'Становая тяга',
    muscleGroup: ['back', 'legs'],
    equipment: ['barbell'],
    difficulty: 'advanced',
    description: 'Король упражнений для спины и ног'
  },
  {
    id: 'ex6',
    name: 'Подтягивания',
    muscleGroup: ['back', 'arms'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    description: 'Базовое упражнение для широчайших мышц'
  },
  {
    id: 'ex7',
    name: 'Тяга штанги в наклоне',
    muscleGroup: ['back'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'Эффективное упражнение для средней части спины'
  },
  {
    id: 'ex8',
    name: 'Тяга гантели одной рукой',
    muscleGroup: ['back'],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    description: 'Изолированная проработка каждой стороны спины'
  },
  
  // Legs
  {
    id: 'ex9',
    name: 'Приседания со штангой',
    muscleGroup: ['legs'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'Базовое упражнение для ног и ягодиц'
  },
  {
    id: 'ex10',
    name: 'Выпады',
    muscleGroup: ['legs'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    description: 'Упражнение для квадрицепсов и ягодиц'
  },
  {
    id: 'ex11',
    name: 'Жим ногами',
    muscleGroup: ['legs'],
    equipment: ['machine'],
    difficulty: 'beginner',
    description: 'Упражнение в тренажере для ног'
  },
  {
    id: 'ex12',
    name: 'Румынская тяга',
    muscleGroup: ['legs', 'back'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'Упражнение для задней поверхности бедра'
  },
  
  // Arms
  {
    id: 'ex13',
    name: 'Подъем штанги на бицепс',
    muscleGroup: ['arms'],
    equipment: ['barbell'],
    difficulty: 'beginner',
    description: 'Классическое упражнение для бицепса'
  },
  {
    id: 'ex14',
    name: 'Французский жим',
    muscleGroup: ['arms'],
    equipment: ['dumbbell'],
    difficulty: 'intermediate',
    description: 'Упражнение для трицепса'
  },
  {
    id: 'ex15',
    name: 'Молотки',
    muscleGroup: ['arms'],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    description: 'Упражнение для брахиалиса и бицепса'
  },
  
  // Shoulders
  {
    id: 'ex16',
    name: 'Жим штанги стоя',
    muscleGroup: ['shoulders'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'Базовое упражнение для дельт'
  },
  {
    id: 'ex17',
    name: 'Махи гантелями в стороны',
    muscleGroup: ['shoulders'],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    description: 'Изолирующее упражнение для средних дельт'
  },
  {
    id: 'ex18',
    name: 'Тяга к подбородку',
    muscleGroup: ['shoulders'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'Упражнение для средних и передних дельт'
  },
  
  // Core
  {
    id: 'ex19',
    name: 'Планка',
    muscleGroup: ['core'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    description: 'Статическое упражнение для пресса'
  },
  {
    id: 'ex20',
    name: 'Скручивания',
    muscleGroup: ['core'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    description: 'Классическое упражнение для пресса'
  },
  {
    id: 'ex21',
    name: 'Подъем ног',
    muscleGroup: ['core'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    description: 'Упражнение для нижнего пресса'
  }
];

