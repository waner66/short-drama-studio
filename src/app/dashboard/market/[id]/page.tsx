import TemplateDetailClient from './_client';

export async function generateStaticParams() {
  return [{ id: 'demo' }];
}

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  return <TemplateDetailClient params={params} />;
}
