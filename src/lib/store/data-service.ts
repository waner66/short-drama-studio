/**
 * 客户端数据服务 (简化版)
 * 前端直接操作 localStorage
 */

import { generateId, listEntities, createEntity, updateEntity, deleteEntity } from './local-store';

// ====== 用户服务 ======
export const userService = {
  register(username: string, password: string, email?: string, phone?: string) {
    const existing = listEntities('users', (u: Record<string, unknown>) => u.username === username);
    if (existing.length > 0) throw new Error('用户名已存在');

    return createEntity('users', {
      username,
      email: email || null,
      phone: phone || null,
      passwordHash: btoa(password),
      avatarUrl: null,
      bio: null,
      role: 'USER',
    });
  },

  login(username: string, password: string) {
    const users = listEntities('users', (u: Record<string, unknown>) => u.username === username);
    if (users.length === 0) throw new Error('用户不存在');
    const user = users[0];
    if (btoa(password) !== user.passwordHash) throw new Error('密码错误');
    return user;
  },

  getById(id: string) {
    const users = listEntities('users', (u: Record<string, unknown>) => u.id === id);
    return users[0] || null;
  },
};

// ====== 角色服务 ======
export const characterService = {
  listByUser(userId: string) {
    return listEntities('characters', (c: Record<string, unknown>) => c.userId === userId);
  },
  create(userId: string, data: Record<string, unknown>) {
    return createEntity('characters', {
      ...data,
      userId,
      avatarUrl: null,
      isAiGenerated: data.isAiGenerated || false,
      tags: data.tags || [],
    });
  },
  delete(id: string) {
    return deleteEntity('characters', id);
  },
};

// ====== 项目服务 ======
export const projectService = {
  listByUser(userId: string) {
    return listEntities('projects', (p: Record<string, unknown>) => p.userId === userId);
  },
  create(userId: string, data: Record<string, unknown>) {
    return createEntity('projects', {
      ...data,
      userId,
      status: 'DRAFT',
      coverUrl: null,
      duration: null,
    });
  },
  delete(id: string) {
    return deleteEntity('projects', id);
  },
};

// ====== 模板服务 ======
export const templateService = {
  listAll() {
    return listEntities('templates');
  },
  listByCreator(creatorId: string) {
    return listEntities('templates', (t: Record<string, unknown>) => t.creatorId === creatorId);
  },
  getPublished() {
    return listEntities('templates', (t: Record<string, unknown>) => t.status === 'PUBLISHED');
  },
  publish(creatorId: string, data: Record<string, unknown>) {
    return createEntity('templates', {
      ...data,
      creatorId,
      status: 'REVIEWING',
      salesCount: 0,
      avgRating: 0,
      downloadCount: 0,
      coverUrl: null,
      previewUrl: null,
    });
  },
};

// ====== 订单服务 ======
export const orderService = {
  listByBuyer(buyerId: string) {
    return listEntities('orders', (o: Record<string, unknown>) => o.buyerId === buyerId);
  },
  create(buyerId: string, templateId: string, amount: number) {
    const platformFee = Number((amount * 0.15).toFixed(2));
    return createEntity('orders', {
      buyerId,
      templateId,
      orderNo: `OD${Date.now()}`,
      amount,
      platformFee,
      creatorRevenue: Number((amount - platformFee).toFixed(2)),
      status: 'PENDING',
      paidAt: null,
    });
  },
};
