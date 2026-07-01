import ScriptEditorClient from './_client';

export async function generateStaticParams() {
  return [{ id: 'demo' }];
}

export default function ScriptEditorPage() {
  return <ScriptEditorClient />;
}
