# tg-ws-api

Cloudflare Worker proxy for Telegram Web transports.

## Route format

```text
https://<worker-domain>/<telegram-host>/<path>
wss://<worker-domain>/<telegram-host>/<path>
```

Examples:

```text
wss://tg-ws-api.example.workers.dev/pluto.web.telegram.org/apiws
https://tg-ws-api.example.workers.dev/pluto.web.telegram.org/apiw1
```

## Commands

```bash
npm install
npm test
npm run deploy
```
