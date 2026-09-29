# Agent service starter

A service other AI agents pay per call in USDC, on **Arc** or **Base**. An [EarnKit](https://earnkit.com) starter.

- Paid HTTP endpoints using [x402](https://docs.x402.org): an unpaid call gets `402 Payment Required`, and the calling agent pays and retries automatically.
- Payments settle through [Circle's Facilitator Service](https://developers.circle.com/facilitator-service). Start with no account (keyless trial), or add a Circle API key.
- A docs page (`/`), `/llms.txt`, and an MCP server (`/api/mcp`) so agents can find your endpoints.

The example endpoint is a placeholder. Swap in whatever your service does.

## Quick start

```sh
npm install
cp .env.example .env.local
npm run wallet          # prints PAY_TO and SELLER_PRIVATE_KEY; paste both into .env.local
npm run dev
```

Check the paywall:

```sh
curl -i "http://localhost:3000/api/example?name=agent"   # → 402 with a PAYMENT-REQUIRED header
```

Pay for a call like a buyer agent would. Create a second wallet with `npm run wallet`, get test USDC for it at [faucet.circle.com](https://faucet.circle.com) (Arc testnet), and put its key in `BUYER_PRIVATE_KEY`:

```sh
npm run pay -- "http://localhost:3000/api/example?name=agent"
```

## Add your own endpoint

1. Add an entry (path, price, description) to `src/lib/endpoints.ts`.
2. Create `src/app/api/<name>/route.ts`:

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { paid } from '@/lib/paid';

export const runtime = 'nodejs';

export const GET = paid('/api/<name>', async (req: NextRequest) => {
  return NextResponse.json({ result: '...' });
});
```

The docs page, `/llms.txt`, and the MCP `list_paid_endpoints` tool update from the same list. A payment settles only if your handler succeeds, so buyers never pay for errors.

## Go live

1. Deploy (e.g. `npx vercel`) and set the variables from `.env.example`, including `NEXT_PUBLIC_APP_URL`.
2. For real payments set `NETWORK=arc` (or `base`).
3. The keyless trial allows a limited number of settlements per `PAY_TO`. After that, create a key in [Circle Console](https://console.circle.com), set `CIRCLE_API_KEY`, and remove `SELLER_PRIVATE_KEY` from the server.

## Networks

| `NETWORK` | Chain | USDC |
|---|---|---|
| `arc-testnet` (default) | Arc testnet, `eip155:5042002` | `0x3600000000000000000000000000000000000000` |
| `arc` | Arc, `eip155:5042` | `0x3600000000000000000000000000000000000000` |
| `base-sepolia` | Base Sepolia, `eip155:84532` | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| `base` | Base, `eip155:8453` | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |

**Buyers on Arc:** x402 clients only pay in tokens they recognize, and `@x402` 2.27 doesn't list Arc USDC yet. Buyer agents have to allow it explicitly (`spendControls.allowedAssets`, as `scripts/pay.mts` does) until their client knows it.

## How it works

```
buyer agent ──GET /api/example──▶ 402 + PAYMENT-REQUIRED (price, USDC, network, PAY_TO)
buyer agent ──same request + PAYMENT-SIGNATURE (signed USDC authorization)──▶
  service: verify with Circle → run your handler → settle with Circle → 200 + PAYMENT-RESPONSE
```

- `src/lib/endpoints.ts`: paid endpoints and prices (the one list everything reads)
- `src/lib/paid.ts`: the `paid()` wrapper (official `@x402/next`)
- `src/lib/circle-facilitator.ts`: Circle Facilitator Service client (API key or keyless seller proof)
- `src/lib/networks.ts`: network constants, checked against Circle and the USDC contracts
- `src/app/api/mcp/route.ts` + `src/lib/tools/`: MCP server with free tools

MIT licensed.
