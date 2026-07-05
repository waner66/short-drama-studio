import { NextRequest, NextResponse } from 'next/server';
import { officialTemplates } from '@/lib/data/character-templates';
import { sceneTemplates } from '@/lib/data/scene-templates';
import { plotTemplates } from '@/lib/data/plot-templates';

export function generateStaticParams() {
  return [];
}

// GET /api/templates/bundle?type=character&id=X
// 返回与指定模板匹配的其他类型模板
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const genre = searchParams.get('genre');

  if (!type) {
    return NextResponse.json({ error: 'type parameter required: character|scene|plot' }, { status: 400 });
  }

  let matchedScenes: any[] = [];
  let matchedPlots: any[] = [];
  let matchedCharacters: any[] = [];

  // 基于 genre 做规则匹配
  const targetGenre = genre || '甜宠恋爱';

  if (type === 'character') {
    const template = officialTemplates.find(t => t.id === id);
    const matchGenre = template?.genre || targetGenre;

    // 直接关联优先，回退到 genre 匹配
    matchedScenes = template?.compatibleSceneIds?.length
      ? sceneTemplates.filter(s => template.compatibleSceneIds!.includes(s.id))
      : sceneTemplates.filter(s => s.era === (matchGenre.includes('古装') ? '古代' : '现代'));
    
    matchedPlots = template?.compatiblePlotIds?.length
      ? plotTemplates.filter(p => template.compatiblePlotIds!.includes(p.id))
      : plotTemplates.filter(p => p.genre === matchGenre);

  } else if (type === 'scene') {
    const template = sceneTemplates.find(s => s.id === id);
    const matchGenre = genre || '甜宠恋爱';

    matchedCharacters = template?.compatibleCharacterIds?.length
      ? officialTemplates.filter(c => template.compatibleCharacterIds!.includes(c.id))
      : officialTemplates.filter(c => c.genre === matchGenre);

    matchedPlots = template?.compatiblePlotIds?.length
      ? plotTemplates.filter(p => template.compatiblePlotIds!.includes(p.id))
      : plotTemplates.filter(p => p.genre === matchGenre);

  } else if (type === 'plot') {
    const template = plotTemplates.find(p => p.id === id);
    const matchGenre = template?.genre || targetGenre;

    matchedCharacters = template?.compatibleCharacterIds?.length
      ? officialTemplates.filter(c => template.compatibleCharacterIds!.includes(c.id))
      : officialTemplates.filter(c => c.genre === matchGenre);

    matchedScenes = template?.compatibleSceneIds?.length
      ? sceneTemplates.filter(s => template.compatibleSceneIds!.includes(s.id))
      : sceneTemplates.filter(s => s.era === (matchGenre.includes('古装') ? '古代' : '现代'));
  }

  return NextResponse.json({
    character: type === 'character' ? officialTemplates.find(t => t.id === id) : null,
    scene: type === 'scene' ? sceneTemplates.find(s => s.id === id) : null,
    plot: type === 'plot' ? plotTemplates.find(p => p.id === id) : null,
    matchedScenes: matchedScenes.slice(0, 3),
    matchedPlots: matchedPlots.slice(0, 3),
    matchedCharacters: matchedCharacters.slice(0, 3),
    matchMethod: 'genre',
  });
}
