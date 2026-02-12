import { useState } from 'react';
import {
  specToMarkdown,
  copyToClipboard,
  downloadAsMarkdown,
  downloadAsTxt,
} from '../utils/exportUtils';

export default function ExportButtons({ spec }) {
  const [copied, setCopied] = useState(false);

  if (!spec) return null;

  const handleCopy = async () => {
    try {
      const md = specToMarkdown(spec);
      await copyToClipboard(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-600/60 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-medium transition-all touch-manipulation shadow-sm"
      >
        {copied ? (
          <>
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy as Markdown
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => downloadAsMarkdown(spec)}
        className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-600/60 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-medium transition-all touch-manipulation shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download .md
      </button>
      <button
        type="button"
        onClick={() => downloadAsTxt(spec)}
        className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-600/60 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-medium transition-all touch-manipulation shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download .txt
      </button>
    </div>
  );
}
