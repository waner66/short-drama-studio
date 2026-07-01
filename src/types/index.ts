// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: 'USER' | 'CREATOR' | 'ADMIN';
}

// 角色相关类型
export interface Character {
  id: string;
  userId: string;
  name: string;
  gender: string | null;
  age: number | null;
  personality: string | null;
  backstory: string | null;
  avatarUrl: string | null;
  style: string | null;
  isAiGenerated: boolean;
  tags: string[];
  // 新增字段 - 人物设定模板 v2
  archetype: string | null;
  narrativeRole: string | null;
  arcDescription: string | null;
  surfaceTraits: string[];
  innerTraits: string[];
  catchphrase: string | null;
  signatureAction: string | null;
  weakness: string | null;
  desire: string | null;
  voiceTone: string | null;
  appearanceDesc: string | null;
  imagePrompt: string | null;
  templateId: string | null;
  // 大五人格
  extraversion: number; // 1-5
  agreeableness: number;
  conscientiousness: number;
  neuroticism: number;
  openness: number;
  createdAt: string;
  updatedAt: string;
}

// 角色模板相关类型 (复用 TemplateStatus)
export interface CharacterTemplate {
  id: string;
  name: string;
  description: string;
  genre: string;
  archetype: string;
  defaultData: Record<string, unknown>;
  coverPrompt?: string;
  price: number;
  status: TemplateStatus;
  salesCount: number;
  avgRating: number;
  usageCount: number;
  favoriteCount: number;
  reviewCount: number;
  tags: string[];
  isOfficial: boolean;
  creatorId: string | null;
  creatorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterTemplateReview {
  id: string;
  templateId: string;
  userId: string;
  userName?: string;
  rating: number;
  content: string | null;
  createdAt: string;
}

export interface CharacterTemplateFavorite {
  id: string;
  templateId: string;
  userId: string;
  createdAt: string;
}

export interface CharacterTemplatePurchase {
  id: string;
  buyerId: string;
  templateId: string;
  orderNo: string;
  amount: number;
  platformFee: number;
  creatorRevenue: number;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

export interface CharacterRelation {
  id: string;
  projectId: string;
  characterAId: string;
  characterBId: string;
  relationType: string;
  description: string | null;
  createdAt: string;
}

// 项目相关类型
export type ProjectStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'PUBLISHED';

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  status: ProjectStatus;
  duration: number | null;
  genre: string | null;
  isTemplate: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

// 场景相关类型
export interface Scene {
  id: string;
  projectId: string;
  sceneNumber: number;
  title: string;
  location: string | null;
  timeOfDay: string | null;
  weather: string | null;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
}

// 分镜相关类型
export type ShotType = 'CLOSE_UP' | 'MEDIUM' | 'FULL' | 'LONG';

export interface Storyboard {
  id: string;
  sceneId: string;
  storyboardNumber: number;
  shotType: ShotType;
  angle: string | null;
  movement: string | null;
  description: string | null;
  durationSeconds: number;
  dialogue: string | null;
  notes: string | null;
  sortOrder: number;
}

// 模板相关类型
export type TemplateStatus = 'DRAFT' | 'REVIEWING' | 'PUBLISHED' | 'DELISTED';

export interface Template {
  id: string;
  creatorId: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  previewUrl: string | null;
  price: number;
  category: string | null;
  tags: string[];
  status: TemplateStatus;
  salesCount: number;
  avgRating: number;
  downloadCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// 订单相关类型
export type OrderStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'CANCELLED';

export interface Order {
  id: string;
  buyerId: string;
  templateId: string;
  orderNo: string;
  amount: number;
  platformFee: number;
  creatorRevenue: number;
  status: OrderStatus;
  paidAt: string | null;
  createdAt: string;
}

// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// 分页类型
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
