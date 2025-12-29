import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

// Toast store
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    
    // Auto-remove after duration
    const duration = toast.duration || 3000;
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

// Hook for easy toast creation
export function useToast() {
  const addToast = useToastStore((s) => s.addToast);
  
  const showItemUsed = useCallback((itemName: string, useText: string) => {
    addToast({
      message: `${itemName}: ${useText}`,
      type: 'success',
      duration: 4000,
    });
  }, [addToast]);

  const showWarning = useCallback((message: string) => {
    addToast({
      message,
      type: 'warning',
      duration: 3000,
    });
  }, [addToast]);

  const showInfo = useCallback((message: string) => {
    addToast({
      message,
      type: 'info',
      duration: 3000,
    });
  }, [addToast]);

  return { showItemUsed, showWarning, showInfo };
}

// Toast display component
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation before removal
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, (toast.duration || 3000) - 300);

    return () => clearTimeout(exitTimer);
  }, [toast.duration]);

  const bgColor = {
    success: 'bg-green-900/90 border-green-700',
    warning: 'bg-yellow-900/90 border-yellow-700',
    info: 'bg-blue-900/90 border-blue-700',
  }[toast.type];

  const icon = {
    success: '✨',
    warning: '⚠️',
    info: 'ℹ️',
  }[toast.type];

  return (
    <div
      className={`${bgColor} border rounded-lg px-4 py-3 shadow-lg flex items-start gap-3 transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <p className="text-sm flex-1">{toast.message}</p>
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-white transition-colors"
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
