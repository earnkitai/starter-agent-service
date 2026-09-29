import { NETWORKS, type NetworkKey } from './networks';

/**
 * Typed env access. Missing payment config throws where it's used (not at import), so the
 * docs pages still build and render without it.
 */
function env(name: string) {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}

export function getNetwork() {
  const key = (env('NETWORK') ?? 'arc-testnet') as NetworkKey;
  const network = NETWORKS[key];
  if (!network) {
    throw new Error(`NETWORK must be one of: ${Object.keys(NETWORKS).join(', ')} (got "${key}")`);
  }
  return network;
}

/** Wallet that receives USDC. */
export function getPayTo() {
  const payTo = env('PAY_TO');
  if (!payTo || !/^0x[0-9a-fA-F]{40}$/.test(payTo)) {
    throw new Error('PAY_TO must be the 0x address that receives payments');
  }
  return payTo as `0x${string}`;
}

/** Circle API key (production). Without it, the keyless trial is used. */
export const getCircleApiKey = () => env('CIRCLE_API_KEY');

/** Private key controlling PAY_TO, only for the keyless trial's seller proof. */
export const getSellerPrivateKey = () => env('SELLER_PRIVATE_KEY') as `0x${string}` | undefined;

export const getAppName = () => env('NEXT_PUBLIC_APP_NAME') ?? 'My Agent Service';
export const getAppDescription = () =>
  env('NEXT_PUBLIC_APP_DESCRIPTION') ?? 'A service other agents pay per call in USDC.';
export const getAppUrl = () => (env('NEXT_PUBLIC_APP_URL') ?? 'http://localhost:3000').replace(/\/+$/, '');
