import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/storyboards?sceneId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sceneId = searchParams.get('sceneId');

    if (!sceneId) {
      return NextResponse.json({ error: '缺少 sceneId 参数' }, { status: 400 });
    }

    const storyboards = await prisma.storyboard.findMany({
      where: { sceneId },
      orderBy: { sortOrder: 'asc' },
      include: {
        images: true,
        voiceLines: true,
      },
    });

    return NextResponse.json({ storyboards });
  } catch (error) {
    console.error('List storyboards error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// POST /api/storyboards
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sceneId, shotType, description, dialogue, durationSeconds } = body;

    const maxStoryboard = await prisma.storyboard.findFirst({
      where: { sceneId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true, storyboardNumber: true },
    });

    const storyboard = await prisma.storyboard.create({
      data: {
        sceneId,
        storyboardNumber: (maxStoryboard?.storyboardNumber || 0) + 1,
        shotType: shotType || 'MEDIUM',
        description: description || null,
        dialogue: dialogue || null,
        durationSeconds: durationSeconds || 5,
        sortOrder: (maxStoryboard?.sortOrder || 0) + 1,
      },
    });

    return NextResponse.json({ storyboard }, { status: 201 });
  } catch (error) {
    console.error('Create storyboard error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
