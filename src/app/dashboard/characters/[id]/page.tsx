export async function generateStaticParams() {
  return [{ id: 'demo' }];
}

import CharacterDetailClient from './page-client';

export default function CharacterDetailPage({ params }: { params: { id: string } }) {
  return <CharacterDetailClient params={params} />;
}
