const TASK_GROUPS = ['Frontend', 'Backend', 'Database', 'Testing', 'DevOps'];

export const specToMarkdown = (spec) => {
  if (!spec) return '';

  let md = `# ${spec.title || 'Product Spec'}\n\n`;

  const overview = spec.overview || spec.goal;
  if (overview) {
    md += `## Overview\n\n${overview}\n\n`;
  }

  if (spec.userStories?.length) {
    md += `## User Stories\n\n`;
    spec.userStories.forEach((story, i) => {
      md += `${i + 1}. ${typeof story === 'string' ? story : story.text || story}\n`;
    });
    md += '\n';
  }

  if (spec.tasks) {
    TASK_GROUPS.forEach((group) => {
      const tasks = spec.tasks[group.toLowerCase()] || spec.tasks[group] || [];
      if (tasks.length) {
        md += `## ${group} Tasks\n\n`;
        tasks.forEach((task) => {
          const text = typeof task === 'string' ? task : task?.text || task;
          const done = task?.completed ? 'x' : ' ';
          md += `- [${done}] ${text}\n`;
        });
        md += '\n';
      }
    });
  }

  if (spec.risks?.length) {
    md += `## Risks\n\n`;
    spec.risks.forEach((risk, i) => {
      md += `${i + 1}. ${typeof risk === 'string' ? risk : risk.text || risk}\n`;
    });
    md += '\n';
  }

  return md.trim();
};

export const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
};

export const downloadFile = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadAsMarkdown = (spec) => {
  const content = specToMarkdown(spec);
  const filename = `${(spec.title || 'spec').replace(/\s+/g, '-').toLowerCase()}.md`;
  downloadFile(content, filename);
};

export const downloadAsTxt = (spec) => {
  const content = specToMarkdown(spec);
  const filename = `${(spec.title || 'spec').replace(/\s+/g, '-').toLowerCase()}.txt`;
  downloadFile(content, filename);
};
