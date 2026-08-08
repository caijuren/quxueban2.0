import { ToastType } from '@/components/ui/toast';

let toastApi: {
  addToast: (toast: {
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
  }) => string;
} | null = null;

export function registerToastApi(api: typeof toastApi) {
  toastApi = api;
}

function addToast(type: ToastType, title: string, description?: string, duration?: number) {
  if (!toastApi) {
    if (typeof window !== 'undefined') {
      console.warn('[toast] ToastProvider not registered');
    }
    return '';
  }
  return toastApi.addToast({ type, title, description, duration });
}

export const toast = {
  success: (title: string, description?: string, duration?: number) =>
    addToast('success', title, description, duration),
  error: (title: string, description?: string, duration?: number) =>
    addToast('error', title, description, duration),
  warning: (title: string, description?: string, duration?: number) =>
    addToast('warning', title, description, duration),
  info: (title: string, description?: string, duration?: number) =>
    addToast('info', title, description, duration),
};
