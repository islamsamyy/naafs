import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error, retry: () => void) => React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.retry);
      }

      return (
        <div className="flex flex-col items-center justify-center py-20 text-center" dir="rtl">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-black text-[#0A0E1A] mb-2">حدث خطأ</h3>
          <p className="text-[#8892A4] text-sm max-w-md mb-6">
            {this.state.error?.message || 'حدث خطأ غير متوقع. يرجى حاول مجددا'}
          </p>
          <button
            onClick={this.retry}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-black text-sm hover:opacity-90 active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            جرب مجددا
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
