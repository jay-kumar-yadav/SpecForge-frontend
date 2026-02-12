import { createContext, useContext, useState, useCallback } from 'react';
import { generateSpec, saveSpec, getSpecs, getSpecById } from '../utils/api';

const SpecContext = createContext(null);
const TASK_GROUPS = ['Frontend', 'Backend', 'Database', 'Testing', 'DevOps'];

const defaultTasks = () =>
  Object.fromEntries(TASK_GROUPS.map((g) => [g.toLowerCase(), []]));

const normalizeTask = (t, index) => {
  if (typeof t === 'string') return { id: `t-${index}`, text: t, completed: false };
  return { id: t._id?.toString() ?? t.id ?? `t-${index}`, text: t.text ?? t, completed: t.completed ?? false };
};

const normalizeTasks = (tasks) => {
  if (!tasks) return defaultTasks();
  const result = {};
  TASK_GROUPS.forEach((g) => {
    const key = g.toLowerCase();
    const arr = tasks[key] || tasks[g] || [];
    result[key] = arr.map((t, i) => normalizeTask(t, i));
  });
  return result;
};

export function SpecProvider({ children }) {
  const [currentSpec, setCurrentSpec] = useState(null);
  const [recentSpecs, setRecentSpecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRecentSpecs = useCallback(async () => {
    try {
      const data = await getSpecs();
      setRecentSpecs(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch {
      setRecentSpecs([]);
    }
  }, []);

  const createSpec = useCallback(async (featureData) => {
    setLoading(true);
    setError(null);
    try {
      const generated = await generateSpec(featureData);
      const normalized = {
        ...generated,
        tasks: normalizeTasks(generated.tasks),
      };
      const saved = await saveSpec(normalized);
      const spec = {
        ...saved,
        id: saved._id?.toString() ?? saved.id,
        overview: saved.goal,
        tasks: normalizeTasks(saved.tasks),
        createdAt: saved.createdAt ?? new Date().toISOString(),
      };
      setCurrentSpec(spec);
      setRecentSpecs((prev) => [spec, ...prev.filter((s) => s.id !== spec.id)].slice(0, 5));
      return spec;
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? 'Failed to generate spec';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSpec = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      let data = await getSpecById(id);
      if (!data) {
        const fromRecent = recentSpecs.find((s) => s.id === id);
        if (fromRecent) data = fromRecent;
      }
      if (!data) {
        setError('Spec not found');
        return null;
      }
      const spec = {
        ...data,
        id: data._id?.toString() ?? data.id,
        overview: data.goal,
        tasks: normalizeTasks(data.tasks),
      };
      setCurrentSpec(spec);
      return spec;
    } catch (err) {
      const fromRecent = recentSpecs.find((s) => s.id === id || s._id === id);
      if (fromRecent) {
        setCurrentSpec({ ...fromRecent, tasks: normalizeTasks(fromRecent.tasks) });
        return fromRecent;
      }
      setError(err.response?.data?.message || err.message || 'Failed to load spec');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [recentSpecs]);

  const updateTask = useCallback((groupId, taskId, updates) => {
    setCurrentSpec((prev) => {
      if (!prev) return prev;
      const tasks = { ...prev.tasks };
      const list = [...(tasks[groupId] || [])];
      const idx = list.findIndex((t) => t.id === taskId);
      if (idx >= 0) list[idx] = { ...list[idx], ...updates };
      tasks[groupId] = list;
      return { ...prev, tasks };
    });
  }, []);

  const updateTaskText = useCallback(
    (groupId, taskId, text) => updateTask(groupId, taskId, { text }),
    [updateTask]
  );

  const addTask = useCallback((groupId) => {
    const id = crypto.randomUUID();
    setCurrentSpec((prev) => {
      if (!prev) return prev;
      const tasks = { ...prev.tasks };
      tasks[groupId] = [...(tasks[groupId] || []), { id, text: 'New task', completed: false }];
      return { ...prev, tasks };
    });
    return id;
  }, []);

  const deleteTask = useCallback((groupId, taskId) => {
    setCurrentSpec((prev) => {
      if (!prev) return prev;
      const tasks = { ...prev.tasks };
      tasks[groupId] = (tasks[groupId] || []).filter((t) => t.id !== taskId);
      return { ...prev, tasks };
    });
  }, []);

  const toggleTaskComplete = useCallback(
    (groupId, taskId) => {
      setCurrentSpec((prev) => {
        if (!prev) return prev;
        const list = (prev.tasks[groupId] || []).map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        return { ...prev, tasks: { ...prev.tasks, [groupId]: list } };
      });
    },
    []
  );

  const reorderTasks = useCallback((groupId, tasks) => {
    setCurrentSpec((prev) => {
      if (!prev) return prev;
      return { ...prev, tasks: { ...prev.tasks, [groupId]: tasks } };
    });
  }, []);

  const moveTask = useCallback((sourceGroupId, destGroupId, sourceIndex, destIndex) => {
    setCurrentSpec((prev) => {
      if (!prev) return prev;
      const tasks = { ...prev.tasks };
      const sourceList = [...(tasks[sourceGroupId] || [])];
      const destList = [...(tasks[destGroupId] || [])];
      const [moved] = sourceList.splice(sourceIndex, 1);
      destList.splice(destIndex, 0, moved);
      return {
        ...prev,
        tasks: {
          ...tasks,
          [sourceGroupId]: sourceList,
          [destGroupId]: destList,
        },
      };
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const clearSpec = useCallback(() => setCurrentSpec(null), []);

  const value = {
    currentSpec,
    recentSpecs,
    loading,
    error,
    loadRecentSpecs,
    createSpec,
    loadSpec,
    updateTaskText,
    addTask,
    deleteTask,
    toggleTaskComplete,
    reorderTasks,
    moveTask,
    clearError,
    clearSpec,
  };

  return <SpecContext.Provider value={value}>{children}</SpecContext.Provider>;
}

export function useSpec() {
  const ctx = useContext(SpecContext);
  if (!ctx) throw new Error('useSpec must be used within SpecProvider');
  return ctx;
}
