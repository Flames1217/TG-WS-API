import {buildProxyTargetUrl, getRequestMode} from './proxyTarget';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}

function describeService(request: Request) {
  const url = new URL(request.url);
  const base = `${url.protocol === 'https:' ? 'https' : 'http'}://${url.host}`;
  const wsBase = `${url.protocol === 'https:' ? 'wss' : 'ws'}://${url.host}`;

  return json({
    status: 'ok',
    service: 'TG-WS-API',
    type: 'Cloudflare Telegram Web Proxy',
    description: 'Proxy Telegram Web websocket and https transport through /<telegram-host>/<path>.',
    usage: `${base}/<telegram-host>/<path>`,
    examples: {
      websocket: `${wsBase}/pluto.web.telegram.org/apiws`,
      https: `${base}/pluto.web.telegram.org/apiw1`
    },
    allowedHostPattern: '*.web.telegram.org'
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if(url.pathname === '/' || url.pathname === '') {
      return describeService(request);
    }

    const mode = getRequestMode(request.headers);
    const upstreamUrl = buildProxyTargetUrl(request.url, mode);
    if(!upstreamUrl) {
      return json({
        status: 'error',
        message: 'Expected /<telegram-host>/<path> and only allows *.web.telegram.org.'
      }, 400);
    }

    const proxiedRequest = new Request(upstreamUrl.toString(), request);
    return fetch(proxiedRequest);
  }
};
