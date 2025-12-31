import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  icon?: string;
}

const toasts = ref<Toast[]>([]);

let toastIdCounter = 0;

export function useToast() {
  const show = (message: string, type: ToastType = 'info', duration: number = 3000, icon?: string) => {
    const id = `toast-${toastIdCounter++}`;
    const toast: Toast = {
      id,
      message,
      type,
      duration,
      icon
    };

    toasts.value.push(toast);

    // Автоматическое удаление после duration
    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  };

  const remove = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (message: string, duration?: number, icon?: string) => {
    return show(message, 'success', duration, icon);
  };

  const error = (message: string, duration?: number, icon?: string) => {
    return show(message, 'error', duration, icon);
  };

  const info = (message: string, duration?: number, icon?: string) => {
    return show(message, 'info', duration, icon);
  };

  const warning = (message: string, duration?: number, icon?: string) => {
    return show(message, 'warning', duration, icon);
  };

  return {
    toasts,
    show,
    remove,
    success,
    error,
    info,
    warning
  };
}

