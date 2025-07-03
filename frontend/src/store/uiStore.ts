import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface UIState {
  // Global loading state
  isGlobalLoading: boolean;
  
  // Notifications
  notifications: Notification[];
  
  // Modal state
  isModalOpen: boolean;
  modalContent: any;
  
  // Mobile menu
  isMobileMenuOpen: boolean;
  
  // Actions
  setGlobalLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  openModal: (content: any) => void;
  closeModal: () => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

const initialState = {
  isGlobalLoading: false,
  notifications: [],
  isModalOpen: false,
  modalContent: null,
  isMobileMenuOpen: false,
};

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),
      
      addNotification: (notification) => {
        const id = Date.now().toString();
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id }]
        }));
        
        // Auto-remove notification after duration
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration || 5000);
        }
      },
      
      removeNotification: (id) => 
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      openModal: (content) => set({ isModalOpen: true, modalContent: content }),
      
      closeModal: () => set({ isModalOpen: false, modalContent: null }),
      
      toggleMobileMenu: () => 
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
    }),
    {
      name: 'ui-store',
    }
  )
); 