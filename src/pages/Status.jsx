import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHealth } from '../utils/api';
import ThemeToggle from '../components/ThemeToggle';

function StatusBadge({ ok, label }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${
        ok ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${ok ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      {label}
    </span>
  );
}

export default function Status() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchHealth() {
      try {
        setError(null);
        const data = await getHealth();
        if (!cancelled) setHealth(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to fetch status');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen dashboard-gradient dashboard-pattern">
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-lg mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">System Status</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Health of backend, database, and LLM connection
        </p>

        {loading && (
          <div className="rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-700/60 p-8 text-center">
            <div className="animate-spin w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-sm text-zinc-500">Checking...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-6">
            <p className="text-rose-700 dark:text-rose-300 font-medium">Could not reach backend</p>
            <p className="text-sm text-rose-600 dark:text-rose-400 mt-1">{error}</p>
            <p className="text-xs text-zinc-500 mt-3">Ensure the API server is running and CORS is configured.</p>
          </div>
        )}

        {health && !loading && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200/80 dark:border-zinc-700/60 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Overall</h2>
                <StatusBadge ok={health.overall === 'healthy'} label={health.overall} />
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                v{health.version || '1.0.0'}
              </p>
            </div>

            {['backend', 'database', 'llm'].map((key) => {
              const item = health[key];
              if (!item) return null;
              const ok = item.ok;
              return (
                <div
                  key={key}
                  className="rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200/80 dark:border-zinc-700/60 p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">{key}</h3>
                    <StatusBadge ok={ok} label={ok ? 'OK' : 'Issues'} />
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.message || (ok ? 'Operational' : 'Check configuration')}
                  </p>
                  {key === 'llm' && item.configured === false && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      Set GROQ_API_KEY for AI-powered generation. Fallback templates will be used.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
