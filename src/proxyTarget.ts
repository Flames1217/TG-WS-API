export type ProxyMode = 'https' | 'websocket';

const TELEGRAM_WEB_HOST_PATTERN = /\.web\.telegram\.org$/;

export function parseTelegramProxyPath(pathname: string) {
  const trimmed = pathname.replace(/^\/+/, '');
  if(!trimmed) {
    return null;
  }

  const [host, ...pathParts] = trimmed.split('/');
  if(!host) {
    return null;
  }

  return {
    host,
    path: `/${pathParts.join('/')}`.replace(/\/+$/, '') || '/'
  };
}

export function getRequestMode(headers: Headers): ProxyMode {
  return headers.get('Upgrade')?.toLowerCase() === 'websocket' ? 'websocket' : 'https';
}

export function isAllowedTelegramHost(host: string) {
  return TELEGRAM_WEB_HOST_PATTERN.test(host);
}

export function buildProxyTargetUrl(requestUrl: string, mode: ProxyMode) {
  const incomingUrl = new URL(requestUrl);
  const target = parseTelegramProxyPath(incomingUrl.pathname);

  if(!target || !isAllowedTelegramHost(target.host)) {
    return null;
  }

  const upstreamUrl = new URL(`${mode === 'websocket' ? 'wss' : 'https'}://${target.host}${target.path}`);
  upstreamUrl.search = incomingUrl.search;

  return upstreamUrl;
}
