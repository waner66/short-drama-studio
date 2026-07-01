/**
 * 本地数据存储层
 * 用 localStorage 模拟数据库，开发阶段无需 PostgreSQL
 * 后续可无缝切换为 Prisma + PostgreSQL
 */

const STORAGE_KEY = 'shortdrama_store';

interface StoreData {
  users: Record<string, unknown>;
  characters: Record<string, unknown>;
  projects: Record<string, unknown>;
  scenes: Record<string, unknown>;
  storyboards: Record<string, unknown>;
  templates: Record<string, unknown>;
  orders: Record<string, unknown>;
  reviews: Record<string, unknown>;
  favorites: Record<string, unknown>;
  follows: Record<string, unknown>;
  quotas: Record<string, unknown>;
  subscriptions: Record<string, unknown>;
}

function getStore(): StoreData {
  if (typeof window === 'undefined') return getDefaultStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getDefaultStore();
  } catch {
    return getDefaultStore();
  }
}

function saveStore(data: StoreData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getDefaultStore(): StoreData {
  return {
    users: {},
    characters: {},
    projects: {},
    scenes: {},
    storyboards: {},
    templates: {},
    orders: {},
    reviews: {},
    favorites: {},
    follows: {},
    quotas: {},
    subscriptions: {},
  };
}

// 生成简单 ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// 通用 CRUD
export function createEntity<T extends Record<string, unknown>>(
  collection: keyof StoreData,
  data: T
): T & { id: string; createdAt: string } {
  const store = getStore();
  const id = generateId();
  const entity = { ...data, id, createdAt: new Date().toISOString() } as T & { id: string; createdAt: string };
  (store[collection] as Record<string, unknown>)[id] = entity;
  saveStore(store);
  return entity;
}

export function getEntity<T>(
  collection: keyof StoreData,
  id: string
): T | null {
  const store = getStore();
  const coll = store[collection] as Record<string, T>;
  return coll[id] || null;
}

export function updateEntity<T extends object>(
  collection: keyof StoreData,
  id: string,
  updates: Partial<T>
): T | null {
  const store = getStore();
  const coll = store[collection] as Record<string, T>;
  if (!coll[id]) return null;
  coll[id] = { ...coll[id], ...updates, id };
  saveStore(store);
  return coll[id];
}

export function deleteEntity(collection: keyof StoreData, id: string): boolean {
  const store = getStore();
  const coll = store[collection] as Record<string, unknown>;
  if (!coll[id]) return false;
  delete coll[id];
  saveStore(store);
  return true;
}

export function listEntities<T>(
  collection: keyof StoreData,
  filter?: (item: T) => boolean
): T[] {
  const store = getStore();
  const coll = store[collection] as Record<string, T>;
  const items = Object.values(coll);
  return filter ? items.filter(filter) : items;
}

// 用户专用方法
export function getCurrentUser(): { id: string; username: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

// 初始化演示数据
export function initDemoData() {
  const user = getCurrentUser();
  if (!user) return;

  const store = getStore();
  const uid = user.id;

  // 创建演示角色
  if (!Object.values(store.characters).some((c: unknown) => (c as { userId?: string }).userId === uid)) {
    const c1 = createEntity('characters', {
      userId: uid,
      name: '林小羽',
      gender: '女',
      age: 22,
      personality: '活泼开朗、善良纯真，总是对生活充满热情',
      backstory: '出生普通家庭，大学毕业后追随梦想来到大城市',
      style: '写实',
      isAiGenerated: true,
      tags: ['主角', '甜宠'],
    });
    const c2 = createEntity('characters', {
      userId: uid,
      name: '陈墨',
      gender: '男',
      age: 28,
      personality: '冷静沉稳、心思缜密',
      backstory: '商界精英，表面冷酷内心温柔',
      style: '写实',
      isAiGenerated: true,
      tags: ['主角', '霸总'],
    });
  }

  // 创建演示项目
  if (!Object.values(store.projects).some((p: unknown) => (p as { userId?: string }).userId === uid)) {
    createEntity('projects', {
      userId: uid,
      title: '穿越之我在古代当总裁',
      description: '现代女总裁意外穿越古代，用现代商业思维在古代商界掀起一场风暴',
      status: 'IN_PROGRESS',
      genre: '古装甜宠',
      duration: 120,
    });
  }
}
