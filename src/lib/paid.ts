import { x402ResourceServer } from '@x402/core/server';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { withX402 } from '@x402/next';
import type { NextRequest, NextResponse } from 'next/server';
import { circleFacilitator } from './circle-facilitator';
import { getNetwork, getPayTo } from './config';
import { endpoint } from './endpoints';
import { usdc } from './networks';

/** One x402 resource server for the app, settling through Circle's Facilitator Service. */
export const server = new x402ResourceServer(circleFacilitator).register('eip155:*', new ExactEvmScheme());

/**
 * Wraps a route handler so each call costs the endpoint's price in USDC.
 * Unpaid calls get HTTP 402 with payment requirements; paid calls run the handler, and the
 * payment settles only if the handler succeeds (status < 400), so buyers never pay for errors.
 */
export function paid<T>(path: string, handler: (req: NextRequest) => Promise<NextResponse<T>>) {
  const ep = endpoint(path);
  const network = getNetwork();
  return withX402(
    handler,
    {
      [ep.path]: {
        accepts: {
          scheme: 'exact',
          network: network.id,
          price: usdc(network, ep.priceUsd),
          payTo: () => getPayTo(), // read per request so builds work without PAY_TO set
        },
        description: ep.description,
        mimeType: 'application/json',
      },
    },
    server,
  );
}
