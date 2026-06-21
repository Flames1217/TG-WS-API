import {describe, expect, it} from 'vitest';

import {
  buildProxyTargetUrl,
  getRequestMode,
  parseTelegramProxyPath
} from './proxyTarget';

describe('parseTelegramProxyPath', () => {
  it('extracts host and path from the worker route format', () => {
    expect(parseTelegramProxyPath('/pluto.web.telegram.org/apiws')).toEqual({
      host: 'pluto.web.telegram.org',
      path: '/apiws'
    });
  });

  it('rejects missing telegram hosts', () => {
    expect(parseTelegramProxyPath('/')).toBeNull();
    expect(parseTelegramProxyPath('')).toBeNull();
  });
});

describe('getRequestMode', () => {
  it('detects websocket upgrades', () => {
    expect(getRequestMode(new Headers({Upgrade: 'websocket'}))).toBe('websocket');
  });

  it('defaults to https for normal requests', () => {
    expect(getRequestMode(new Headers())).toBe('https');
  });
});

describe('buildProxyTargetUrl', () => {
  it('builds wss upstream urls for websocket traffic', () => {
    expect(buildProxyTargetUrl(
      'https://tg-ws-api.sylpol.workers.dev/pluto.web.telegram.org/apiws?locationHint=weur',
      'websocket'
    )?.toString()).toBe('wss://pluto.web.telegram.org/apiws?locationHint=weur');
  });

  it('builds https upstream urls for http traffic', () => {
    expect(buildProxyTargetUrl(
      'https://tg-ws-api.sylpol.workers.dev/venus-1.web.telegram.org/apiw1',
      'https'
    )?.toString()).toBe('https://venus-1.web.telegram.org/apiw1');
  });

  it('rejects non telegram web hosts', () => {
    expect(buildProxyTargetUrl(
      'https://tg-ws-api.sylpol.workers.dev/example.com/apiws',
      'websocket'
    )).toBeNull();
  });
});
