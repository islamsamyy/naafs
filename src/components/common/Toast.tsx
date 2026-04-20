import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

const toastContext = React.createContext<{
  show: (type: ToastType, message: string, duration?: number) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = (type: ToastType, message: string, duration: number = 3000) => {
    const id = Date.now().toString();
    const toast: ToastMessage = { id, type, message, duration };
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  };

  const remove = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <toastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 space-y-3 z-[999]" dir="rtl">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => remove(toast.id)} />
        ))}
      </div>
    </toastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(toastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastProps extends ToastMessage {
  onClose: () => void;
}

function Toast({ id, type, message, onClose }: ToastProps) {
  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-50 text-green-700 border-green-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-yellow-500',
  };

  return (
    <div className={`${colors[type]} border rounded-xl p-4 flex items-start gap-3 max-w-sm animate-slide-in shadow-lg`}>
      <div className={iconColors[type]} style={{ flexShrink: 0 }}>
        {icons[type]}
      </div>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
