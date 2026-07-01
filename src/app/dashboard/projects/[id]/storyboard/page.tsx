import StoryboardEditorClient from './_client';

export async function generateStaticParams() {
  return [{ id: 'demo' }];
}

export default function StoryboardEditorPage() {
  return <StoryboardEditorClient />;
}
