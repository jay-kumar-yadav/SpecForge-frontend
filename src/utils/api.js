import axios from 'axios';
const baseURL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || '/api');

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('specforge_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('specforge_token');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(err);
  }
);

/** Map frontend form fields to backend API shape */
const toApiInput = (form) => ({
  title: form.title,
  goal: form.goal,
  users: form.targetUsers ? (Array.isArray(form.targetUsers) ? form.targetUsers : [String(form.targetUsers)]) : [],
  constraints: form.constraints || '',
  templateType: form.templateType || 'Web App',
  complexity: form.complexity || 'Medium',
});

export const generateSpec = async (featureData) => {
  const { data } = await api.post('/generate', toApiInput(featureData));
  return data?.data ?? data;
};

const tasksToPayload = (tasks) => {
  if (!tasks) return {};
  const out = {};
  for (const [k, arr] of Object.entries(tasks)) {
    out[k] = (arr || []).map((t) => ({ text: t.text ?? t, completed: t.completed ?? false }));
  }
  return out;
};

export const saveSpec = async (spec) => {
  const payload = {
    title: spec.title,
    goal: spec.goal,
    users: spec.users || [],
    constraints: spec.constraints || '',
    templateType: spec.templateType || 'Web App',
    complexity: spec.complexity || 'Medium',
    userStories: spec.userStories || [],
    tasks: tasksToPayload(spec.tasks),
    risks: spec.risks || [],
  };
  const { data } = await api.post('/spec', payload);
  return data?.data ?? data;
};

export const getSpecs = async () => {
  const { data } = await api.get('/specs');
  return data?.data ?? data ?? [];
};

export const getSpecById = async (id) => {
  const { data } = await api.get(`/spec/${id}`);
  return data?.data ?? data;
};

export const getHealth = async () => {
  try {
    const { data } = await api.get('/health');
    return data?.data ?? data;
  } catch (err) {
    if (err.response?.data?.data) return err.response.data.data;
    throw err;
  }
};

export default api;
