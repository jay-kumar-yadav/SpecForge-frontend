import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const steps = [
  {
    num: 1,
    title: 'Fill in feature details',
    desc: 'Enter your product name, goal, target users, template type, and complexity.',
  },
  {
    num: 2,
    title: 'Generate spec',
    desc: 'Click "Generate Spec" – our AI creates user stories, tasks, and risks.',
  },
  {
    num: 3,
    title: 'Review the task board',
    desc: 'Drag tasks between columns, mark complete, or add new tasks.',
  },
  {
    num: 4,
    title: 'Export',
    desc: 'Copy as Markdown or download as .md or .txt file.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen dashboard-gradient dashboard-pattern">
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/25 mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            SpecForge
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            AI-powered product spec generator
          </p>
        </div>

        <div className="rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200/80 dark:border-zinc-700/60 shadow-xl p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
            How to use SpecForge
          </h2>
          <ol className="space-y-6">
            {steps.map((step) => (
              <li key={step.num} className="flex gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{step.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/app"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-md shadow-amber-500/25 transition-all"
          >
            Get Started
          </Link>
          <Link
            to="/status"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700/80 transition-all"
          >
            View Status
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <Link to="/status" className="underline hover:no-underline">System status</Link>
        </p>
      </div>
    </div>
  );
}
