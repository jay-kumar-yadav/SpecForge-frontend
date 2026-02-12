import { useState, useEffect } from 'react';
import FeatureForm from '../components/FeatureForm';
import TaskBoard from '../components/TaskBoard';
import Sidebar from '../components/Sidebar';
import ExportButtons from '../components/ExportButtons';
import { useSpec } from '../context/SpecContext';

// Reusable section icon
const SectionIcon = ({ children, className = '' }) => (
  <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 ${className}`}>
    {children}
  </div>
);

export default function Dashboard() {
  const { currentSpec } = useSpec();
  const [showForm, setShowForm] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setShowForm(!currentSpec);
  }, [currentSpec]);

  const totalTasks = currentSpec?.tasks
    ? Object.values(currentSpec.tasks).reduce((sum, arr) => sum + (arr?.length || 0), 0)
    : 0;
  const completedTasks = currentSpec?.tasks
    ? Object.values(currentSpec.tasks).reduce(
        (sum, arr) => sum + (arr?.filter((t) => t.completed)?.length || 0),
        0
      )
    : 0;

  return (
    <div className="flex min-h-screen dashboard-gradient dashboard-pattern overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 min-w-0">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 animate-card-enter">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2.5 -ml-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-white/60 dark:hover:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 transition-all"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/25">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    SpecForge
                  </h1>
                  <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {currentSpec ? currentSpec.title || 'Product Spec' : 'Generate and manage product specs'}
                  </p>
                </div>
              </div>
            </div>
            {currentSpec && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-sm font-medium transition-all shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/30 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Spec
                </button>
                <ExportButtons spec={currentSpec} />
              </div>
            )}
          </header>

          {/* Stats strip (when spec exists) */}
          {currentSpec && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 animate-card-enter animate-card-enter-delay-1">
              {[
                { label: 'Tasks', value: `${completedTasks}/${totalTasks}` },
                { label: 'User Stories', value: currentSpec.userStories?.length || 0 },
                { label: 'Risks', value: currentSpec.risks?.length || 0 },
                { label: 'Columns', value: Object.keys(currentSpec.tasks || {}).length },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200/80 dark:border-zinc-700/60 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {stat.label}
                    </span>
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Feature Form Section */}
          {showForm && (
            <section className="rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200/80 dark:border-zinc-700/60 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50 p-5 sm:p-7 animate-card-enter animate-card-enter-delay-2">
              <div className="flex items-center gap-3 mb-5">
                <SectionIcon>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </SectionIcon>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Feature Details
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Describe your product or feature to generate a spec</p>
                </div>
              </div>
              <FeatureForm />
            </section>
          )}

          {currentSpec && (
            <>
              {/* Overview */}
              <section className="rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200/80 dark:border-zinc-700/60 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50 p-5 sm:p-7 overflow-hidden animate-card-enter animate-card-enter-delay-3">
                <div className="flex items-center gap-3 mb-4">
                  <SectionIcon>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </SectionIcon>
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Overview
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
                  {currentSpec.overview || currentSpec.goal || 'No overview provided.'}
                </p>
              </section>

              {/* User Stories */}
              {currentSpec.userStories?.length > 0 && (
                <section className="rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200/80 dark:border-zinc-700/60 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50 p-5 sm:p-7 animate-card-enter animate-card-enter-delay-4">
                  <div className="flex items-center gap-3 mb-4">
                    <SectionIcon>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </SectionIcon>
                    <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                      User Stories
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {currentSpec.userStories.map((story, i) => (
                      <li
                        key={i}
                        className="flex gap-3 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40"
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-200/80 dark:bg-amber-800/50 text-amber-800 dark:text-amber-200 font-semibold text-sm flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 min-w-0">
                          {typeof story === 'string' ? story : story.text || story}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Task Board */}
              <section className="rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200/80 dark:border-zinc-700/60 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50 p-5 sm:p-7 overflow-hidden animate-card-enter animate-card-enter-delay-5">
                <div className="flex items-center gap-3 mb-4">
                  <SectionIcon>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </SectionIcon>
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Task Board
                  </h2>
                </div>
                <TaskBoard />
              </section>

              {/* Risks */}
              {currentSpec.risks?.length > 0 && (
                <section className="rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200/80 dark:border-zinc-700/60 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50 p-5 sm:p-7 animate-card-enter animate-card-enter-delay-5">
                  <div className="flex items-center gap-3 mb-4">
                    <SectionIcon className="!bg-rose-100 dark:!bg-rose-900/40 !text-rose-600 dark:!text-rose-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </SectionIcon>
                    <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                      Risks
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {currentSpec.risks.map((risk, i) => (
                      <li
                        key={i}
                        className="flex gap-3 p-3 rounded-xl bg-rose-50/80 dark:bg-rose-900/20 border border-rose-200/60 dark:border-rose-800/40"
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-rose-200/80 dark:bg-rose-800/50 text-rose-800 dark:text-rose-200 font-semibold text-sm flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 min-w-0">
                          {typeof risk === 'string' ? risk : risk.text || risk}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
