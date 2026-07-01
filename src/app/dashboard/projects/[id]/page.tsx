import ProjectDetailClient from './_client';

export async function generateStaticParams() {
  return [{ id: 'demo' }];
}

export default function ProjectDetailPage() {
  return <ProjectDetailClient />;
}
