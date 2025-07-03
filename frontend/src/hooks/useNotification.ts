import { useCallback } from 'react';
import { useUIStore } from '../store/uiStore';

export const useNotification = () => {
  const { addNotification } = useUIStore();

  const showSuccess = useCallback((message: string, duration?: number) => {
    addNotification({ type: 'success', message, duration });
  }, [addNotification]);

  const showError = useCallback((message: string, duration?: number) => {
    addNotification({ type: 'error', message, duration });
  }, [addNotification]);

  const showWarning = useCallback((message: string, duration?: number) => {
    addNotification({ type: 'warning', message, duration });
  }, [addNotification]);

  const showInfo = useCallback((message: string, duration?: number) => {
    addNotification({ type: 'info', message, duration });
  }, [addNotification]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}; 