/**
 * Reads the prototype HTML files from the monorepo root prototype/ folder
 * at SSR time and rewrites their inter-page anchor links to point at the
 * matching Next.js routes. Dev/preview only — production builds would need
 * the HTML to be copied or inlined.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const PROTO_DIR = join(process.cwd(), '..', '..', 'prototype');

const FILE_BY_SCREEN: Record<string, string> = {
  landing: '01-landing.html',
  onboarding: '02-onboarding.html',
  upload: '03-upload.html',
  room: '04-room-confirm.html',
  style: '05-style-picker.html',
  budget: '06-budget.html',
  generating: '07-generating.html',
  viewer: '08-viewer.html',
  upgrade: '09-upgrade.html',
  signup: '10-signup.html',
  login: '11-login.html',
  forgot: '12-forgot.html',
};

const ROUTE_BY_FILENAME: Record<string, string> = {
  'index.html': '/',
  '01-landing.html': '/landing',
  '02-onboarding.html': '/onboarding',
  '03-upload.html': '/upload',
  '04-room-confirm.html': '/room',
  '05-style-picker.html': '/style',
  '06-budget.html': '/budget',
  '07-generating.html': '/generating',
  '08-viewer.html': '/viewer',
  '09-upgrade.html': '/upgrade',
  '10-signup.html': '/signup',
  '11-login.html': '/login',
  '12-forgot.html': '/forgot',
};

export const SCREEN_SLUGS = Object.keys(FILE_BY_SCREEN);

export const SCREEN_TITLES: Record<string, string> = {
  landing: 'Landing',
  onboarding: 'Taste quiz',
  upload: 'Upload',
  room: 'Room confirmation',
  style: 'Style picker',
  budget: 'Naira budget',
  generating: 'Generating',
  viewer: 'Render + budget',
  upgrade: 'Plan upgrade',
  signup: 'Sign up',
  login: 'Sign in',
  forgot: 'Reset password',
};

function extractBody(html: string): string {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
  return match?.[1] ?? html;
}

function rewriteUrls(html: string): string {
  let out = html;
  for (const [filename, route] of Object.entries(ROUTE_BY_FILENAME)) {
    out = out.replaceAll(`href="${filename}"`, `href="${route}"`);
    out = out.replaceAll(`src="${filename}"`, `src="${route}"`);
  }
  // Strip the prototype's local stylesheet link — globals.css already has it.
  out = out.replace(/<link[^>]*style\.css[^>]*>/g, '');
  return out;
}

export function loadScreen(slug: string): string {
  const file = FILE_BY_SCREEN[slug];
  if (!file) {
    throw new Error(`Unknown screen slug: ${slug}`);
  }
  const raw = readFileSync(join(PROTO_DIR, file), 'utf-8');
  return rewriteUrls(extractBody(raw));
}

export function loadIndex(): string {
  const raw = readFileSync(join(PROTO_DIR, 'index.html'), 'utf-8');
  return rewriteUrls(extractBody(raw));
}
