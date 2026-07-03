export function generateStaticParams() {
  return [{ id: 'demo' }];
}

import RelationsClient from './page-client';

export default function RelationsPage({ params }: { params: { id: string } }) {
  return <RelationsClient params={params} />;
}
