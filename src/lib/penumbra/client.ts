import { createPenumbraClient, PenumbraClient } from '@penumbra-zone/client';

/**
 * Penumbra client configuration
 * This file sets up the penumbra service instance for use throughout the application
 */

export const penumbra = createPenumbraClient();

const reconnect = async () => {
  const providers = PenumbraClient.getProviders();
  const connected = Object.keys(providers).find(origin =>
    PenumbraClient.isProviderConnected(origin),
  );
  if (!connected) {
    return;
  }
  try {
    await penumbra.connect(connected);
  } catch (error) {
    /* no-op */
  }
};
void reconnect();

/**
 * Configuration for the penumbra client
 * TODO: Replace with actual configuration values if needed
 */
export const PENUMBRA_CONFIG = {
  // TODO: Add actual RPC endpoint if needed
  rpcEndpoint: process.env.PENUMBRA_RPC_ENDPOINT || 'http://localhost:8080',
  
  // TODO: Add chain ID if needed
  chainId: process.env.PENUMBRA_CHAIN_ID || 'penumbra-1',
  
  // TODO: Add other necessary configuration
};

/**
 * Initialize the penumbra client with proper configuration
 * The client is already initialized above with createPenumbraClient()
 */
export async function initializePenumbraClient() {
  console.log('Penumbra client initialized with createPenumbraClient()');
  return penumbra;
} 