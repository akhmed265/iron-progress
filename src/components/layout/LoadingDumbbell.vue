<template>
  <div class="loading-overlay" v-if="isLoading">
    <div class="container" :class="{ assemble: isAssembled, disassemble: !isAssembled }">
      <span class="dumbbell-small_left"></span>
      <span class="dumbbell-normal_left"></span>
      <span class="dumbbell-big_left"></span>
      <span class="barbell-bar"></span>
      <span class="dumbbell-small_right"></span>
      <span class="dumbbell-normal_right"></span>
      <span class="dumbbell-big_right"></span>
    </div>
    <div class="loading-message">
      <span class="loading-text">{{ currentMessage }}</span>
      <div class="loading-dots">
        <span v-for="n in 3" :key="n" :style="{ animationDelay: `${n * 0.2}s` }">.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Props {
  autoHide?: boolean;
  hideDelay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  autoHide: true,
  hideDelay: 2500
});

const emit = defineEmits<{
  loaded: [];
}>();

const isLoading = ref(true);
const currentMessage = ref('Собираем гантель');
const isAssembled = ref(false); // Начинаем с разобранного состояния

const messages = [
  'Собираем гантель',
  'Загружаем ваши тренировки',
  'Считаем прогресс',
  'Готово к работе!'
];

let messageIndex = 0;
let messageInterval: number | null = null;
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

onMounted(() => {
  // Запускаем автоматическую анимацию сборки/разборки
  setTimeout(() => {
    autoAnimate();
    // Повторять каждые 4 секунды
    animationInterval = window.setInterval(autoAnimate, 4000);
  }, 1000);

  if (props.autoHide) {
    messageInterval = window.setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      currentMessage.value = messages[messageIndex];
      
      if (messageIndex === messages.length - 1) {
        setTimeout(() => {
          isLoading.value = false;
          emit('loaded');
          if (messageInterval) {
            clearInterval(messageInterval);
          }
          if (animationInterval) {
            clearInterval(animationInterval);
          }
        }, 1000);
        if (messageInterval) {
          clearInterval(messageInterval);
        }
      }
    }, 600);
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $bg-primary;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
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
  background: linear-gradient(90deg, $accent-3, #0088CC);
  z-index: 1;
}

/* Левые блины - начальное положение (разобраны) */
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
  top: 26px;
  left: 55px;
  transition: left 0.7s ease-in-out 0.1s;
  background: $accent-1;
  z-index: 2;
}

.dumbbell-big_left {
  width: 6px;
  height: 35px;
  border-radius: 6px;
  top: 24px;
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
  top: 26px;
  right: 55px;
  transition: right 0.7s ease-in-out 0.1s;
  background: $accent-2;
  z-index: 2;
}

.dumbbell-big_right {
  width: 6px;
  height: 35px;
  border-radius: 6px;
  top: 24px;
  right: 60px;
  transition: right 0.6s ease-in-out 0.2s;
  background: $accent-2;
  z-index: 2;
}

/* Позиции для сборки (блины у грифа) */
.assemble .dumbbell-small_left {
  left: 50px;
}

.assemble .dumbbell-normal_left {
  left: 55px;
}

.assemble .dumbbell-big_left {
  left: 60px;
}

.assemble .dumbbell-small_right {
  right: 50px;
}

.assemble .dumbbell-normal_right {
  right: 55px;
}

.assemble .dumbbell-big_right {
  right: 60px;
}

/* Позиции для разборки (возврат в исходное положение) */
.disassemble .dumbbell-small_left {
  left: 30px;
}

.disassemble .dumbbell-normal_left {
  left: 25px;
}

.disassemble .dumbbell-big_left {
  left: 20px;
}

.disassemble .dumbbell-small_right {
  right: 30px;
}

.disassemble .dumbbell-normal_right {
  right: 25px;
}

.disassemble .dumbbell-big_right {
  right: 20px;
}

.loading-message {
  margin-top: 3rem;
  font-size: 1.2rem;
  color: $text-primary;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.loading-text {
  font-weight: 500;
}

.loading-dots {
  display: inline-flex;
  gap: 0.1rem;
  
  span {
    font-size: 2rem;
    line-height: 1;
    animation: blink 1.4s infinite;
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
