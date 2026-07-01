import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth-helper';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const projects = await prisma.project.findMany({
    where: { userId }, orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json();
  const project = await prisma.project.create({
    data: { userId, title: body.title, description: body.description, genre: body.genre, status: 'DRAFT' },
  });
  return NextResponse.json(project, { status: 201 });
}
