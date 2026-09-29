# Notes for coding agents

This repo is a paid agent service: HTTP endpoints other agents pay per call in USDC via x402,
settled by Circle's Facilitator Service on Arc or Base. Read README.md first.

## Building the builder's idea

- Put the service's real work in the route handler. Keep price and description in
  `src/lib/endpoints.ts`; never hardcode a price in a route.
- Each paid route: `export const GET = paid('<path>', handler)` (or POST). The path must match
  the entry in `endpoints.ts` exactly.
- Return errors with status >= 400 so the buyer isn't charged. Only successful responses settle.
- Replace the example endpoint and the placeholder app name/description.
- Free helpers for agents belong in `src/lib/tools/` (MCP). Paid work stays on HTTP routes.

## Don't

- Don't change values in `src/lib/networks.ts` unless you've checked them against Circle's
  `https://api.circle.com/v1/facilitator/x402/supported` and the USDC contract. The EIP-712 name
  differs per network ("USD Coin" on Base mainnet, "USDC" elsewhere).
- Don't use Arc's 18-decimal native balance for prices. USDC amounts are 6 decimals.
- Don't deliver paid content when settlement is pending (`settlement_pending`). `paid()` already
  refuses; keep it that way.
- Don't expose `SELLER_PRIVATE_KEY` or `CIRCLE_API_KEY` to the client (no `NEXT_PUBLIC_`).

## Setup and checks

```sh
npm install
npm run wallet            # PAY_TO + SELLER_PRIVATE_KEY for .env.local (ask before reusing a wallet)
npm run typecheck && npm run build
npm run dev
curl -i "http://localhost:3000/api/example?name=agent"   # expect 402
npm run pay -- "http://localhost:3000/api/example?name=agent"  # needs BUYER_PRIVATE_KEY with test USDC
```

`npm run pay` failing with `insufficient_funds` means everything works except the buyer's
balance; the builder can fund the buyer at https://faucet.circle.com.

## Deploying for a program

- Arc programs (e.g. Arc Microgrants) need `NETWORK=arc` and a live, working deployment.
- Base programs need `NETWORK=base`; Base grants also ask for Builder Codes.
- The builder must approve spending real funds and anything submitted on their behalf.
