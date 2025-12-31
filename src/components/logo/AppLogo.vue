<template>
  <div 
    class="dumbbell-logo" 
    :class="[`size-${size}`, { animated: isAnimated }]"
    @click="handleClick"
  >
    <div class="container" :class="{ assemble: isAssembled, disassemble: !isAssembled }">
      <span class="dumbbell-small_left"></span>
      <span class="dumbbell-normal_left"></span>
      <span class="dumbbell-big_left"></span>
      <span class="barbell-bar"></span>
      <span class="dumbbell-small_right"></span>
      <span class="dumbbell-normal_right"></span>
      <span class="dumbbell-big_right"></span>
    </div>
    <span v-if="showText" class="logo-text">Iron Progress</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import type { LogoSize } from '@/types/logo.interface';

interface Props {
  size?: LogoSize;
  isAnimated?: boolean;
  animationSpeed?: number;
  showText?: boolean;
  autoAnimate?: boolean; // Автоматическая циклическая анимация
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  isAnimated: false,
  animationSpeed: 1,
  showText: false,
  autoAnimate: false
});

const emit = defineEmits<{
  click: [];
}>();

const isAssembled = ref(false);
let animationInterval: number | null = null;

const assemble = () => {
  isAssembled.value = true;
};

const disassemble = () => {
  isAssembled.value = false;
};

const autoAnimate = () => {
  assemble();
  setTimeout(() => {
    disassemble();
  }, 2000); // Через 2 секунды разбираем
};

const handleClick = () => {
  if (props.autoAnimate) {
    // При клике переключаем состояние
    if (isAssembled.value) {
      disassemble();
    } else {
      assemble();
    }
  } else if (props.isAnimated) {
    assemble();
  } else {
    emit('click');
  }
};

// Следим за изменением isAnimated
watch(() => props.isAnimated, (newVal) => {
  if (newVal) {
    assemble();
  } else {
    disassemble();
  }
}, { immediate: true });

// Автоматическая анимация
onMounted(() => {
  if (props.autoAnimate) {
    setTimeout(() => {
      autoAnimate();
      // Повторять каждые 4 секунды
      animationInterval = window.setInterval(autoAnimate, 4000);
    }, 1000);
  } else if (props.isAnimated) {
    assemble();
  }
});

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval);
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.dumbbell-logo {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover:not(.animated) {
    transform: translateY(-2px);
  }
}

.container {
  position: relative;
  background-color: transparent;
  width: 150px;
  height: 80px;
  margin: 0 auto;

  span {
    position: absolute;
    background-color: $text-primary;
  }
}

/* Гриф */
.barbell-bar {
  width: 60px;
  height: 6px;
  border-radius: 6px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(90deg, $accent-1, #63e7b0);
  z-index: 1;
}

/* Левые блины - начальное положение(разобраны) */
.dumbbell-small_left {
  width: 6px;
  height: 25px;
  border-radius: 6px;
  top: 28px;
  left: 50px;
  transition: left 0.8s ease-in-out;
  background: $accent-1;
  z-index: 2;
}

.dumbbell-normal_left {
  width: 6px;
  height: 30px;
  border-radius: 6px;
  top: 25px;
  left: 55px;
  transition: left 0.7s ease-in-out 0.1s;
  background: $accent-1;
  z-index: 2;
}

.dumbbell-big_left {
  width: 6px;
  height: 35px;
  border-radius: 6px;
  top: 23px;
  left: 60px;
  transition: left 0.6s ease-in-out 0.2s;
  background: $accent-1;
  z-index: 2;
}

/* Правые блины - начальное положение (разобраны) */
.dumbbell-small_right {
  width: 6px;
  height: 25px;
  border-radius: 6px;
  top: 28px;
  right: 50px;
  transition: right 0.8s ease-in-out;
  background: $accent-2;
  z-index: 2;
}

.dumbbell-normal_right {
  width: 6px;
  height: 30px;
  border-radius: 6px;
  top: 25px;
  right: 55px;
  transition: right 0.7s ease-in-out 0.1s;
  background: $accent-2;
  z-index: 2;
}

.dumbbell-big_right {
  width: 6px;
  height: 35px;
  border-radius: 6px;
  top: 23px;
  right: 60px;
  transition: right 0.6s ease-in-out 0.2s;
  background: $accent-2;
  z-index: 2;
}

/* Позиции для сборки (блины у грифа) */
.assemble .dumbbell-small_left {
  left: 20px;
}

.assemble .dumbbell-normal_left {
  left: 25px;
}

.assemble .dumbbell-big_left {
  left: 30px;
}

.assemble .dumbbell-small_right {
  right: 20px;
}

.assemble .dumbbell-normal_right {
  right: 25px;
}

.assemble .dumbbell-big_right {
  right: 30px;
}

/* Позиции для разборки (возврат в исходное положение) */
.disassemble .dumbbell-small_left {
  left: 50px;
}

.disassemble .dumbbell-normal_left {
  left: 55px;
}

.disassemble .dumbbell-big_left {
  left: 60px;
}

.disassemble .dumbbell-small_right {
  right: 50px;
}

.disassemble .dumbbell-normal_right {
  right: 55px;
}

.disassemble .dumbbell-big_right {
  right: 60px;
}

.logo-text {
  font-weight: 600;
  color: $text-primary;
  letter-spacing: 0.05em;
}

/* Размеры */
.size-small {
  .container {
    width: 100px;
    height: 55px;
  }

  .barbell-bar {
    width: 40px;
    height: 4px;
  }

  .dumbbell-small_left,
  .dumbbell-small_right {
    width: 4px;
    height: 18px;
    top: 18px;
  }

  .dumbbell-small_left {
    left: 20px;
  }

  .dumbbell-small_right {
    right: 20px;
  }

  .dumbbell-normal_left,
  .dumbbell-normal_right {
    width: 4px;
    height: 22px;
    top: 16px;
  }

  .dumbbell-normal_left {
    left: 17px;
  }

  .dumbbell-normal_right {
    right: 17px;
  }

  .dumbbell-big_left,
  .dumbbell-big_right {
    width: 4px;
    height: 25px;
    top: 15px;
  }

  .dumbbell-big_left {
    left: 14px;
  }

  .dumbbell-big_right {
    right: 14px;
  }

  .container.assemble .dumbbell-small_left {
    left: 33px;
  }

  .container.assemble .dumbbell-normal_left {
    left: 37px;
  }

  .container.assemble .dumbbell-big_left {
    left: 40px;
  }

  .container.assemble .dumbbell-small_right {
    right: 33px;
  }

  .container.assemble .dumbbell-normal_right {
    right: 37px;
  }

  .container.assemble .dumbbell-big_right {
    right: 40px;
  }

  .container.disassemble .dumbbell-small_left {
    left: 34px;
  }

  .container.disassemble .dumbbell-normal_left {
    left: 37px;
  }

  .container.disassemble .dumbbell-big_left {
    left: 40px;
  }

  .container.disassemble .dumbbell-small_right {
    right: 34px;
  }

  .container.disassemble .dumbbell-normal_right {
    right: 37px;
  }

  .container.disassemble .dumbbell-big_right {
    right: 40px;
  }

  .logo-text {
    font-size: 0.875rem;
  }
}

.size-medium {
  // Размеры по умолчанию уже заданы выше
  .logo-text {
    font-size: 1rem;
  }
}

.size-large {
  .container {
    width: 200px;
    height: 105px;
  }

  .barbell-bar {
    width: 80px;
    height: 8px;
  }

  .dumbbell-small_left,
  .dumbbell-small_right {
    width: 8px;
    height: 32px;
    top: 38px;
  }

  .dumbbell-small_left {
    left: 40px;
  }

  .dumbbell-small_right {
    right: 40px;
  }

  .dumbbell-normal_left,
  .dumbbell-normal_right {
    width: 8px;
    height: 38px;
    top: 36px;
  }

  .dumbbell-normal_left {
    left: 33px;
  }

  .dumbbell-normal_right {
    right: 33px;
  }

  .dumbbell-big_left,
  .dumbbell-big_right {
    width: 8px;
    height: 45px;
    top: 33px;
  }

  .dumbbell-big_left {
    left: 27px;
  }

  .dumbbell-big_right {
    right: 27px;
  }

  .container.assemble .dumbbell-small_left {
    left: 66px;
  }

  .container.assemble .dumbbell-normal_left {
    left: 73px;
  }

  .container.assemble .dumbbell-big_left {
    left: 80px;
  }

  .container.assemble .dumbbell-small_right {
    right: 66px;
  }

  .container.assemble .dumbbell-normal_right {
    right: 73px;
  }

  .container.assemble .dumbbell-big_right {
    right: 80px;
  }

  .container.disassemble .dumbbell-small_left {
    left: 40px;
  }

  .container.disassemble .dumbbell-normal_left {
    left: 33px;
  }

  .container.disassemble .dumbbell-big_left {
    left: 27px;
  }

  .container.disassemble .dumbbell-small_right {
    right: 40px;
  }

  .container.disassemble .dumbbell-normal_right {
    right: 33px;
  }

  .container.disassemble .dumbbell-big_right {
    right: 27px;
  }

  .logo-text {
    font-size: 1.25rem;
  }
}
</style>
