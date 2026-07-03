import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth-helper';
import { findMany, insertOne } from '@/lib/supabase-client';
import { randomUUID } from 'node:crypto';

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    const characters = await findMany('Character', { userId }, '*', 'createdAt.desc');
    return NextResponse.json(characters);
  } catch (error: any) {
    console.error('[GET /api/characters]', error.message);
    return NextResponse.json({ error: '获取角色列表失败' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    const body = await req.json();
    const now = new Date().toISOString();

    const character = await insertOne('Character', {
      id: randomUUID(),
      userId,
      name: body.name,
      gender: body.gender || null,
      age: body.age || null,
      personality: body.personality || null,
      backstory: body.backstory || null,
      style: body.style || null,
      isAiGenerated: body.isAiGenerated || false,
      tags: body.tags || [],
      archetype: body.archetype || null,
      narrativeRole: body.narrativeRole || null,
      arcDescription: body.arcDescription || null,
      surfaceTraits: body.surfaceTraits || [],
      innerTraits: body.innerTraits || [],
      catchphrase: body.catchphrase || null,
      signatureAction: body.signatureAction || null,
      weakness: body.weakness || null,
      desire: body.desire || null,
      voiceTone: body.voiceTone || null,
      appearanceDesc: body.appearanceDesc || null,
      imagePrompt: body.imagePrompt || null,
      templateId: body.templateId || null,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(character, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/characters]', error.message);
    return NextResponse.json({ error: '创建角色失败' }, { status: 500 });
  }
}
