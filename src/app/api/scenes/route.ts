import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/scenes?projectId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: '缺少 projectId 参数' }, { status: 400 });
    }

    const scenes = await prisma.scene.findMany({
      where: { projectId },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { storyboards: true } },
      },
    });

    return NextResponse.json({ scenes });
  } catch (error) {
    console.error('List scenes error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// POST /api/scenes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, title, location, timeOfDay, weather, description } = body;

    // 获取当前最大 sortOrder
    const maxScene = await prisma.scene.findFirst({
      where: { projectId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true, sceneNumber: true },
    });

    const scene = await prisma.scene.create({
      data: {
        projectId,
        sceneNumber: (maxScene?.sceneNumber || 0) + 1,
        title,
        location: location || null,
        timeOfDay: timeOfDay || null,
        weather: weather || null,
        description: description || null,
        sortOrder: (maxScene?.sortOrder || 0) + 1,
      },
    });

    return NextResponse.json({ scene }, { status: 201 });
  } catch (error) {
    console.error('Create scene error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
