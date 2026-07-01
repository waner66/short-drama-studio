import type { User } from '@/types';

const API_BASE = '/api';

// 通用 fetch 封装
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Token 过期，跳转登录
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    throw new Error('未授权，请重新登录');
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || '请求失败');
  }

  return data;
}

// 用户 API
export const authAPI = {
  login: (credentials: { phone?: string; email?: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (data: { username: string; phone?: string; email?: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// 项目 API (占位，后续实现)
export const projectsAPI = {
  list: () => request<{ projects: unknown[] }>('/projects'),
  create: (data: unknown) => request<unknown>('/projects', { method: 'POST', body: JSON.stringify(data) }),
};

// 角色 API (占位)
export const charactersAPI = {
  list: () => request<{ characters: unknown[] }>('/characters'),
  create: (data: unknown) => request<unknown>('/characters', { method: 'POST', body: JSON.stringify(data) }),
};
