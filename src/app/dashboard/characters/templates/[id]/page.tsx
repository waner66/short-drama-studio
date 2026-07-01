import { officialTemplates } from '@/lib/data/character-templates';
import TemplateDetailClient from './page-client';

export function generateStaticParams() {
  return officialTemplates.map(t => ({ id: t.id }));
}

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  return <TemplateDetailClient params={params} />;
}
