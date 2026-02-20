import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen dashboard-gradient dashboard-pattern flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-700/60 shadow-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Something went wrong</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">An unexpected error occurred.</p>
              </div>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              Try refreshing the page. If the problem persists, check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
