<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-logo">
        <AppLogo size="small" :isAnimated="false" />
        <span class="footer-title">Iron Progress</span>
      </div>
      
      <div class="footer-info">
        <p class="copyright">© 2025 Iron Progress. Все права не защищены.</p>
        <p class="author">Дизайн и разработка: <strong>by Malachiyev</strong></p>
      </div>
      
      <nav class="footer-nav">
        <router-link to="/privacy">Политика конфиденциальности</router-link>
        <router-link to="/terms">Условия использования</router-link>
        <router-link to="/contact">Контакты</router-link>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
import AppLogo from '@/components/logo/AppLogo.vue';
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.app-footer {
  background: $bg-secondary;
  padding: $spacing-xl $spacing-md;
  margin-top: auto;
  border-top: 1px solid $bg-tertiary;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-lg;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.footer-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: $text-primary;
}

.footer-info {
  text-align: center;
  color: $text-secondary;
}

.copyright {
  font-size: 0.9rem;
  margin-bottom: $spacing-xs;
}

.author {
  margin-top: $spacing-sm;
  color: $accent-1;
  font-size: 0.9rem;

  strong {
    font-weight: 600;
  }
}

.footer-nav {
  display: flex;
  gap: $spacing-lg;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-nav a {
  color: $text-secondary;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color $transition-base;

  &:hover {
    color: $accent-1;
  }
}

@media (max-width: $breakpoint-mobile) {
  .footer-nav {
    flex-direction: column;
    gap: $spacing-sm;
    align-items: center;
  }

  .footer-content {
    gap: $spacing-md;
  }
}
</style>

