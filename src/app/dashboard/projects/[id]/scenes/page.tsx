import ScenesClient from './_client';

export async function generateStaticParams() {
  return [{ id: 'demo' }];
}

export default function ScenesPage() {
  return <ScenesClient />;
}
