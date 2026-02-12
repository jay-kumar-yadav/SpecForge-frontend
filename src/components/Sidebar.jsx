import { useEffect } from 'react';
import { useSpec } from '../context/SpecContext';

export default function Sidebar({ isOpen = false, onClose, onNavigate }) {
  const { recentSpecs, loadRecentSpecs, loadSpec, currentSpec, clearSpec, loading } = useSpec();

  useEffect(() => {
    loadRecentSpecs();
  }, [loadRecentSpecs]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const handleLoadSpec = (id) => {
    loadSpec(id);
    onNavigate?.();
  };

  const asideClasses = [
    'w-64 shrink-0 border-r border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 p-4',
    'fixed inset-y-0 left-0 z-40 md:static transform transition-transform duration-200 ease-out',
    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
  ].join(' ');

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    <aside className={asideClasses}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Recent Specs</h2>
        <div className="flex items-center gap-2">
          {currentSpec && (
            <button
              type="button"
              onClick={clearSpec}
              className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {recentSpecs.length === 0 && !loading && (
          <li className="text-sm text-zinc-500 dark:text-zinc-400 py-2">
            No specs yet. Generate one to get started.
          </li>
        )}
        {recentSpecs.slice(0, 5).map((spec) => (
          <li key={spec.id}>
            <button
              type="button"
              onClick={() => handleLoadSpec(spec.id)}
              disabled={loading}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                currentSpec?.id === spec.id
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 font-medium'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="block truncate font-medium">{spec.title || 'Untitled'}</span>
              <span className="block truncate text-xs opacity-75 mt-0.5">{formatDate(spec.createdAt)}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
    </>
  );
}
