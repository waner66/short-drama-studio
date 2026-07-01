import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth-helper';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const characters = await prisma.character.findMany({
    where: { userId }, orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(characters);
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json();
  const character = await prisma.character.create({
    data: {
      userId, name: body.name, gender: body.gender, age: body.age,
      personality: body.personality, backstory: body.backstory,
      style: body.style, isAiGenerated: body.isAiGenerated || false,
      tags: body.tags || [], archetype: body.archetype, narrativeRole: body.narrativeRole,
      arcDescription: body.arcDescription, surfaceTraits: body.surfaceTraits || [],
      innerTraits: body.innerTraits || [], catchphrase: body.catchphrase,
      signatureAction: body.signatureAction, weakness: body.weakness,
      desire: body.desire, voiceTone: body.voiceTone,
      appearanceDesc: body.appearanceDesc, imagePrompt: body.imagePrompt,
      templateId: body.templateId,
    },
  });
  return NextResponse.json(character, { status: 201 });
}
