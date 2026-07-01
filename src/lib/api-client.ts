/**
 * 统一 API 客户端
 * 替代 localStorage 数据层，所有数据通过 REST API 读写
 * 后续切换到 PostgreSQL 时无需修改前端代码
 */

const BASE_URL = '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options?.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ====== 角色 API ======
export const characterApi = {
  list: () => request<any[]>('/api/characters'),
  get: (id: string) => request<any>(`/api/characters/${id}`),
  create: (data: Record<string, unknown>) => request<any>('/api/characters', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) => request<any>(`/api/characters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/api/characters/${id}`, { method: 'DELETE' }),
};

// ====== 项目 API ======
export const projectApi = {
  list: () => request<any[]>('/api/projects'),
  get: (id: string) => request<any>(`/api/projects/${id}`),
  create: (data: Record<string, unknown>) => request<any>('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) => request<any>(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/api/projects/${id}`, { method: 'DELETE' }),
};

// ====== 场景 API ======
export const sceneApi = {
  listByProject: (projectId: string) => request<any[]>(`/api/scenes?projectId=${projectId}`),
  get: (id: string) => request<any>(`/api/scenes/${id}`),
  create: (data: Record<string, unknown>) => request<any>('/api/scenes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) => request<any>(`/api/scenes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/api/scenes/${id}`, { method: 'DELETE' }),
};

// ====== 分镜 API ======
export const storyboardApi = {
  listByScene: (sceneId: string) => request<any[]>(`/api/storyboards?sceneId=${sceneId}`),
  get: (id: string) => request<any>(`/api/storyboards/${id}`),
  create: (data: Record<string, unknown>) => request<any>('/api/storyboards', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) => request<any>(`/api/storyboards/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/api/storyboards/${id}`, { method: 'DELETE' }),
};

// ====== 角色模板 API ======
export const templateApi = {
  list: (params?: { genre?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.genre) searchParams.set('genre', params.genre);
    if (params?.search) searchParams.set('search', params.search);
    const qs = searchParams.toString();
    return request<any[]>(`/api/character-templates${qs ? '?' + qs : ''}`);
  },
  get: (id: string) => request<any>(`/api/character-templates/${id}`),
  create: (data: Record<string, unknown>) => request<any>('/api/character-templates', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) => request<any>(`/api/character-templates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/api/character-templates/${id}`, { method: 'DELETE' }),
  myTemplates: () => request<any[]>('/api/character-templates/my'),
  // 收藏
  favorite: (templateId: string) => request<any>('/api/character-template-favorites', { method: 'POST', body: JSON.stringify({ templateId }) }),
  unfavorite: (templateId: string) => request<void>(`/api/character-template-favorites/${templateId}`, { method: 'DELETE' }),
  listFavorites: () => request<any[]>('/api/character-template-favorites'),
  // 评价
  listReviews: (templateId: string) => request<any[]>(`/api/character-template-reviews?templateId=${templateId}`),
  addReview: (templateId: string, data: { rating: number; content?: string }) =>
    request<any>('/api/character-template-reviews', { method: 'POST', body: JSON.stringify({ templateId, ...data }) }),
  // 购买
  purchase: (templateId: string) => request<any>('/api/character-template-purchases', { method: 'POST', body: JSON.stringify({ templateId }) }),
  listPurchases: () => request<any[]>('/api/character-template-purchases'),
};
