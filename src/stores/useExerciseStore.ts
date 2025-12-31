import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Exercise, MuscleGroup, Equipment, Difficulty } from '@/types/exercise.interface';
import { mockExercises } from '@/assets/data/exercises';
import { useLocalStorage } from '@/composables/useLocalStorage';

export const useExerciseStore = defineStore('exercise', () => {
  const storage = useLocalStorage<Exercise[]>('iron-progress-exercises', mockExercises);
  
  const exercises = ref<Exercise[]>(storage.read());
  const searchQuery = ref('');
  const selectedMuscleGroups = ref<MuscleGroup[]>([]);
  const selectedEquipment = ref<Equipment[]>([]);
  const selectedDifficulty = ref<Difficulty | null>(null);

  const filteredExercises = computed(() => {
    let result = exercises.value;

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(ex => 
        ex.name.toLowerCase().includes(query) ||
        ex.description.toLowerCase().includes(query)
      );
    }

    // Muscle group filter
    if (selectedMuscleGroups.value.length > 0) {
      result = result.filter(ex =>
        ex.muscleGroup.some(group => selectedMuscleGroups.value.includes(group))
      );
    }

    // Equipment filter
    if (selectedEquipment.value.length > 0) {
      result = result.filter(ex =>
        ex.equipment.some(eq => selectedEquipment.value.includes(eq))
      );
    }

    // Difficulty filter
    if (selectedDifficulty.value) {
      result = result.filter(ex => ex.difficulty === selectedDifficulty.value);
    }

    return result;
  });

  function addExercise(exercise: Exercise) {
    exercises.value.push(exercise);
    storage.write(exercises.value);
  }

  function updateExercise(id: string, updates: Partial<Exercise>) {
    const index = exercises.value.findIndex(ex => ex.id === id);
    if (index !== -1) {
      exercises.value[index] = { ...exercises.value[index], ...updates };
      storage.write(exercises.value);
    }
  }

  function deleteExercise(id: string) {
    exercises.value = exercises.value.filter(ex => ex.id !== id);
    storage.write(exercises.value);
  }

  function getExerciseById(id: string): Exercise | undefined {
    return exercises.value.find(ex => ex.id === id);
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query;
  }

  function setFilters(filters: {
    muscleGroups?: MuscleGroup[];
    equipment?: Equipment[];
    difficulty?: Difficulty | null;
  }) {
    if (filters.muscleGroups !== undefined) {
      selectedMuscleGroups.value = filters.muscleGroups;
    }
    if (filters.equipment !== undefined) {
      selectedEquipment.value = filters.equipment;
    }
    if (filters.difficulty !== undefined) {
      selectedDifficulty.value = filters.difficulty;
    }
  }

  function clearFilters() {
    searchQuery.value = '';
    selectedMuscleGroups.value = [];
    selectedEquipment.value = [];
    selectedDifficulty.value = null;
  }

  function loadExercises() {
    exercises.value = storage.read();
    if (exercises.value.length === 0) {
      exercises.value = mockExercises;
      storage.write(exercises.value);
    }
  }

  return {
    exercises,
    filteredExercises,
    searchQuery,
    selectedMuscleGroups,
    selectedEquipment,
    selectedDifficulty,
    addExercise,
    updateExercise,
    deleteExercise,
    getExerciseById,
    setSearchQuery,
    setFilters,
    clearFilters,
    loadExercises
  };
});

