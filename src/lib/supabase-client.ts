/**
 * Supabase REST API 客户端
 * 通过 HTTP 协议访问 Supabase PostgREST，绕过 IPv6 直连限制
 *
 * 表名对应 Prisma schema 中的 model 名（无 @@map 时直接使用 model 名）：
 *   User, UserQuota, UserSubscription
 */

const SUPABASE_URL = "https://tdeggpmxmgqgcrceymec.supabase.co";
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getHeaders(): Record<string, string> {
  return {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

async function supabaseFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${SUPABASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase API ${res.status}: ${errText}`);
  }

  const text = await res.text();
  if (!text) return [] as unknown as T;
  return JSON.parse(text) as T;
}

// ==================== 查询辅助 ====================

/**
 * 条件查询 — 获取匹配的第一条记录
 */
export async function findOne<T = any>(
  table: string,
  filters: Record<string, string | number | null>,
  select: string = "*"
): Promise<T | null> {
  const params = new URLSearchParams();
  params.set("select", select);

  for (const [key, value] of Object.entries(filters)) {
    if (value === null) {
      params.set(key, "is.null");
    } else {
      params.set(key, `eq.${value}`);
    }
  }
  params.set("limit", "1");

  const results = await supabaseFetch<T[]>(
    `/rest/v1/${table}?${params.toString()}`
  );
  return results.length > 0 ? results[0] : null;
}

/**
 * 条件查询 — 获取所有匹配记录
 */
export async function findMany<T = any>(
  table: string,
  filters: Record<string, string | number | null>,
  select: string = "*"
): Promise<T[]> {
  const params = new URLSearchParams();
  params.set("select", select);

  for (const [key, value] of Object.entries(filters)) {
    if (value === null) {
      params.set(key, "is.null");
    } else {
      params.set(key, `eq.${value}`);
    }
  }

  return supabaseFetch<T[]>(`/rest/v1/${table}?${params.toString()}`);
}

/**
 * OR 条件查询 — 匹配任一 filter
 */
export async function findOneOr<T = any>(
  table: string,
  filters: Record<string, string | number>[],
  select: string = "*"
): Promise<T | null> {
  for (const filter of filters) {
    const result = await findOne<T>(table, filter, select);
    if (result) return result;
  }
  return null;
}

/**
 * 插入一条记录
 */
export async function insertOne<T = any>(
  table: string,
  data: Record<string, any>
): Promise<T> {
  const results = await supabaseFetch<T[]>(`/rest/v1/${table}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return results[0];
}

// ==================== 用户相关方法 ====================

export interface SupabaseUser {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  passwordHash: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 按手机号或邮箱查找用户
 */
export async function findUser(phone?: string, email?: string): Promise<SupabaseUser | null> {
  const filters: Record<string, string>[] = [];
  if (phone) filters.push({ phone });
  if (email) filters.push({ email });
  if (filters.length === 0) return null;
  return findOneOr<SupabaseUser>("User", filters);
}

/**
 * 按用户名查找用户
 */
export async function findUserByUsername(username: string): Promise<SupabaseUser | null> {
  return findOne<SupabaseUser>("User", { username });
}

/**
 * 创建用户（仅 User 表）
 */
export async function createUser(data: {
  username: string;
  phone: string | null;
  email: string | null;
  passwordHash: string;
  role?: string;
}): Promise<SupabaseUser> {
  return insertOne<SupabaseUser>("User", {
    ...data,
    role: data.role || "USER",
  });
}

/**
 * 创建用户配额
 */
export async function createUserQuota(data: {
  userId: string;
  quotaType: string;
  totalQuota: number;
  usedQuota?: number;
  resetPeriod?: string;
}): Promise<any> {
  return insertOne("UserQuota", {
    userId: data.userId,
    quotaType: data.quotaType,
    totalQuota: data.totalQuota,
    usedQuota: data.usedQuota ?? 0,
    resetPeriod: data.resetPeriod ?? "ONETIME",
  });
}

/**
 * 创建用户订阅
 */
export async function createUserSubscription(data: {
  userId: string;
  plan?: string;
  status?: string;
}): Promise<any> {
  return insertOne("UserSubscription", {
    userId: data.userId,
    plan: data.plan || "FREE",
    status: data.status || "ACTIVE",
  });
}

/**
 * 批量创建用户配额
 */
export async function createUserQuotas(
  userId: string,
  quotas: { quotaType: string; totalQuota: number; usedQuota?: number; resetPeriod?: string }[]
): Promise<void> {
  for (const q of quotas) {
    await createUserQuota({ userId, ...q });
  }
}
