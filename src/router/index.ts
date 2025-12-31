import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { title: 'Главная' }
    },
    {
      path: '/plan',
      name: 'plan',
      component: () => import('@/views/PlanView.vue'),
      meta: { title: 'Мой план' }
    },
    {
      path: '/exercises',
      name: 'exercises',
      component: () => import('@/views/ExercisesView.vue'),
      meta: { title: 'Упражнения' }
    },
    {
      path: '/diary',
      name: 'diary',
      component: () => import('@/views/DiaryView.vue'),
      meta: { title: 'Дневник' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { title: 'Профиль' }
    },
    {
      path: '/workout/:id',
      name: 'workout',
      component: () => import('@/views/WorkoutView.vue'),
      meta: { title: 'Выполнение тренировки' }
    }
  ]
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Iron Progress` : 'Iron Progress';
  next();
});

export default router;

