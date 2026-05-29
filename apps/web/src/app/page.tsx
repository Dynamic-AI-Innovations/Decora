import { loadIndex } from '@/data/screens';

export default function HomePage() {
  const html = loadIndex();
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
