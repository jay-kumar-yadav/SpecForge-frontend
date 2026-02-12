import { useState } from 'react';
import { useSpec } from '../context/SpecContext';

const TEMPLATE_TYPES = ['Web App', 'Mobile App', 'Internal Tool', 'API Service'];
const COMPLEXITY_LEVELS = ['Low', 'Medium', 'High'];

export default function FeatureForm() {
  const { createSpec, loading, error, clearError } = useSpec();
  const [form, setForm] = useState({
    title: '',
    goal: '',
    targetUsers: '',
    constraints: '',
    templateType: 'Web App',
    complexity: 'Medium',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSpec(form);
    } catch {
      // Error handled in context
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-full">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Product or feature name"
          className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
          required
        />
      </div>

      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Goal
        </label>
        <textarea
          id="goal"
          name="goal"
          value={form.goal}
          onChange={handleChange}
          placeholder="What should this achieve?"
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none"
        />
      </div>

      <div>
        <label htmlFor="targetUsers" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Target Users
        </label>
        <input
          id="targetUsers"
          name="targetUsers"
          type="text"
          value={form.targetUsers}
          onChange={handleChange}
          placeholder="e.g. Developers, Product Managers"
          className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
        />
      </div>

      <div>
        <label htmlFor="constraints" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Constraints
        </label>
        <textarea
          id="constraints"
          name="constraints"
          value={form.constraints}
          onChange={handleChange}
          placeholder="Budget, timeline, tech stack..."
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="templateType" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Template Type
          </label>
          <select
            id="templateType"
            name="templateType"
            value={form.templateType}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
          >
            {TEMPLATE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="complexity" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Complexity
          </label>
          <select
            id="complexity"
            name="complexity"
            value={form.complexity}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
          >
            {COMPLEXITY_LEVELS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating...
          </span>
        ) : (
          'Generate Spec'
        )}
      </button>
    </form>
  );
}
