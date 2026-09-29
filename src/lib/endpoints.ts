/**
 * Paid endpoints: the single list the route wrappers, /agents docs, /llms.txt, and the MCP
 * `list_paid_endpoints` tool all read from, so prices and descriptions never drift.
 *
 * To add one: add an entry here, then create `src/app<path>/route.ts` exporting
 * `export const GET = paid('<path>', handler)` (see src/app/api/example/route.ts).
 */
export type PaidEndpoint = {
  path: `/api/${string}`;
  method: 'GET' | 'POST';
  /** One sentence an agent reads to decide whether to pay. */
  description: string;
  /** Price per call in US dollars, paid in USDC. */
  priceUsd: number;
  /** Example query or body, shown in the docs. */
  exampleInput?: Record<string, string>;
  /** What a paid call returns, shown in the docs. */
  exampleOutput?: unknown;
};

export const ENDPOINTS: PaidEndpoint[] = [
  {
    path: '/api/example',
    method: 'GET',
    description: 'Example paid endpoint. Replace it with what your service sells.',
    priceUsd: 0.001,
    exampleInput: { name: 'agent' },
    exampleOutput: { message: 'Hello, agent. You paid $0.001 in USDC.' },
  },
];

export function endpoint(path: string) {
  const ep = ENDPOINTS.find((e) => e.path === path);
  if (!ep) throw new Error(`${path} is not in ENDPOINTS (src/lib/endpoints.ts)`);
  return ep;
}
