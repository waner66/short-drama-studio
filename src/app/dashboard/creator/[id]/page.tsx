import CreatorProfileClient from './_client';

export async function generateStaticParams() {
  return [{ id: 'demo' }];
}

export default function CreatorProfilePage({ params }: { params: { id: string } }) {
  return <CreatorProfileClient params={params} />;
}
