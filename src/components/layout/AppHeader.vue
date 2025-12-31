<template>
  <header class="app-header">
    <div class="header-content">
      <router-link to="/" class="header-logo">
        <AppLogo size="medium" :isAnimated="false" @click="handleLogoClick" />
        <span class="header-title">Iron Progress</span>
      </router-link>
      
      <nav class="header-nav" :class="{ mobile: isMobileMenuOpen }">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path"
          :to="link.path"
          class="nav-link"
          @click="closeMobileMenu"
        >
          <img
            :src="link.iconPath"
            :alt="link.label"
            class="nav-icon"
          />
          <span class="nav-text">{{ link.label }}</span>
        </router-link>
      </nav>
      
      <button 
        class="mobile-menu-toggle"
        @click="toggleMobileMenu"
        aria-label="Toggle menu"
      >
        <span class="hamburger" :class="{ active: isMobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import AppLogo from '@/components/logo/AppLogo.vue';
import homeIcon from '@/assets/icons/home-white.svg';
import calendarWeekIcon from '@/assets/icons/calendar_week-white.svg';
import timerIcon from '@/assets/icons/timer-white.svg';
import notebookIcon from '@/assets/icons/notebool-white.svg';
import userIcon from '@/assets/icons/user-white.svg';

const route = useRoute();
const isMobileMenuOpen = ref(false);

const navLinks = [
  { path: '/', label: 'Главная', icon: 'home', iconPath: homeIcon },
  { path: '/plan', label: 'Мой план', icon: 'calendar-week', iconPath: calendarWeekIcon },
  { path: '/exercises', label: 'Упражнения', icon: 'timer', iconPath: timerIcon },
  { path: '/diary', label: 'Дневник', icon: 'notebook', iconPath: notebookIcon },
  { path: '/profile', label: 'Профиль', icon: 'user', iconPath: userIcon }
];

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogoClick = () => {
  // Можно добавить короткую анимацию при клике
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.app-header {
  background: $bg-secondary;
  border-bottom: 1px solid $bg-tertiary;
  padding: $spacing-md $spacing-lg;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-lg;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  text-decoration: none;
  color: $text-primary;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.header-nav {
  display: flex;
  gap: $spacing-sm;
  flex: 1;
  justify-content: center;

  &.mobile {
    display: flex;
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  color: $text-secondary;
  text-decoration: none;
  transition: all $transition-base;
  position: relative;

  &:hover {
    color: $text-primary;
    background: $bg-tertiary;
  }

  &.router-link-active {
    color: $accent-1;
    background: rgba(0, 200, 150, 0.1);

    .nav-icon {
      filter: brightness(0) saturate(100%) invert(73%) sepia(75%) saturate(400%) hue-rotate(120deg) brightness(95%) contrast(90%);
      opacity: 1;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 2px;
      background: $accent-1;
      border-radius: $radius-full;
    }
  }
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: block;
  object-fit: contain;
}

.nav-text {
  font-weight: 500;
}

.mobile-menu-toggle {
  display: none;
  background: transparent;
  border: none;
  padding: $spacing-sm;
  cursor: pointer;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 24px;
  
  span {
    width: 100%;
    height: 3px;
    background: $text-primary;
    border-radius: $radius-full;
    transition: all $transition-base;
  }

  &.active {
    span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
  }
}

@media (max-width: $breakpoint-mobile) {
  .mobile-menu-toggle {
    display: block;
  }

  .header-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: $bg-secondary;
    border-top: 1px solid $bg-tertiary;
    flex-direction: column;
    padding: $spacing-md;
    gap: $spacing-xs;

    &.mobile {
      display: flex;
    }
  }

  .header-title {
    font-size: 1.25rem;
  }
}
</style>

