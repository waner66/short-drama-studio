import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/character-template-favorites/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // 简化版：开发阶段无需认证
  const userId = req.headers.get('x-user-id') || 'dev-user';
  await prisma.characterTemplateFavorite.deleteMany({
    where: { templateId: params.id, userId },
  });
  return NextResponse.json({ success: true });
}
