/**
 * Typed client for the Decora HTTP API. Used by both apps/web (for SSR-like
 * server actions) and apps/mobile.
 *
 * All inputs/outputs are validated through zod schemas from @decora/shared-types.
 * Network errors are surfaced as DecoraApiError so callers can branch cleanly.
 */

import {
  RenderRequestIn,
  RenderRequestOut,
  type RenderRequestIn as RenderRequestInT,
  type RenderRequestOut as RenderRequestOutT,
} from '@decora/shared-types';

export class DecoraApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'DecoraApiError';
  }
}

export interface DecoraClientConfig {
  baseUrl: string;
  getAuthToken: () => Promise<string | null>;
  fetchImpl?: typeof fetch;
}

export function createDecoraClient(config: DecoraClientConfig) {
  const fetchFn = config.fetchImpl ?? fetch;

  async function request<T>(path: string, init: RequestInit, schema: { parse(d: unknown): T }) {
    const token = await config.getAuthToken();
    const res = await fetchFn(`${config.baseUrl}${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(init.headers ?? {}),
      },
    });

    const body = (await res.json().catch(() => ({}))) as { code?: string; message?: string };

    if (!res.ok) {
      throw new DecoraApiError(
        res.status,
        body.code ?? 'unknown_error',
        body.message ?? res.statusText,
      );
    }
    return schema.parse(body);
  }

  return {
    async submitRender(input: RenderRequestInT): Promise<RenderRequestOutT> {
      const payload = RenderRequestIn.parse(input);
      return request(
        '/api/renders',
        { method: 'POST', body: JSON.stringify(payload) },
        RenderRequestOut,
      );
    },
  };
}

export type DecoraClient = ReturnType<typeof createDecoraClient>;
