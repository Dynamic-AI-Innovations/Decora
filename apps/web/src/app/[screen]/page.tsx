import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { loadScreen, SCREEN_SLUGS, SCREEN_TITLES } from '@/data/screens';

export function generateStaticParams() {
  return SCREEN_SLUGS.map((screen) => ({ screen }));
}

export function generateMetadata({ params }: { params: { screen: string } }): Metadata {
  const title = SCREEN_TITLES[params.screen];
  return title ? { title } : {};
}

export default function ScreenPage({ params }: { params: { screen: string } }) {
  if (!SCREEN_SLUGS.includes(params.screen)) {
    notFound();
  }
  const html = loadScreen(params.screen);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
