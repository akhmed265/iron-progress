<template>
  <div class="product-card" @click="$emit('click', product)">
    <div class="product-card__image" v-if="product.image">
      <img :src="product.image" :alt="product.name" />
    </div>
    <div class="product-card__image-placeholder" v-else>
      <span class="placeholder-icon">🍽️</span>
    </div>
    
    <div class="product-card__content">
      <h3 class="product-card__name">{{ product.name }}</h3>
      <p class="product-card__category">{{ categoryLabel }}</p>
      
      <div class="product-card__macros">
        <div class="macro-item">
          <span class="macro-value">{{ product.calories }}</span>
          <span class="macro-label">ккал</span>
        </div>
        <div class="macro-item">
          <span class="macro-value">{{ product.protein }}г</span>
          <span class="macro-label">Б</span>
        </div>
        <div class="macro-item">
          <span class="macro-value">{{ product.fat }}г</span>
          <span class="macro-label">Ж</span>
        </div>
        <div class="macro-item">
          <span class="macro-value">{{ product.carbs }}г</span>
          <span class="macro-label">У</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '@/types/nutrition.interface';

interface Props {
  product: Product;
}

const props = defineProps<Props>();

defineEmits<{
  click: [product: Product];
}>();

const categoryLabels: Record<string, string> = {
  grains: 'Крупы',
  fruits: 'Фрукты',
  vegetables: 'Овощи',
  protein: 'Белок',
  dairy: 'Молочные',
  nuts: 'Орехи',
  beverages: 'Напитки',
  other: 'Другое'
};

const categoryLabel = computed(() => categoryLabels[props.product.category] || props.product.category);
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.product-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-md;
  cursor: pointer;
  transition: all $transition-base;
  border: 2px solid transparent;

  &:hover {
    border-color: $accent-1;
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }
}

.product-card__image,
.product-card__image-placeholder {
  width: 100%;
  height: 150px;
  border-radius: $radius-md;
  margin-bottom: $spacing-md;
  overflow: hidden;
  background: $bg-tertiary;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.placeholder-icon {
  font-size: 3rem;
  opacity: 0.5;
}

.product-card__content {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.product-card__name {
  font-size: 1.125rem;
  font-weight: 600;
  color: $text-primary;
  margin: 0;
}

.product-card__category {
  font-size: 0.875rem;
  color: $text-secondary;
  margin: 0;
}

.product-card__macros {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-xs;
  margin-top: $spacing-xs;
}

.macro-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xs;
  background: $bg-tertiary;
  border-radius: $radius-sm;
}

.macro-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: $text-primary;
}

.macro-label {
  font-size: 0.75rem;
  color: $text-secondary;
}

@media (max-width: $breakpoint-mobile) {
  .product-card__macros {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

