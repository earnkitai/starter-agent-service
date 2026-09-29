/**
 * Create a new wallet for this service: use the address as PAY_TO and, for the keyless
 * trial, the private key as SELLER_PRIVATE_KEY. Store the key somewhere safe.
 *
 *   npm run wallet
 */
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

const key = generatePrivateKey();
console.log(`PAY_TO=${privateKeyToAccount(key).address}`);
console.log(`SELLER_PRIVATE_KEY=${key}`);
