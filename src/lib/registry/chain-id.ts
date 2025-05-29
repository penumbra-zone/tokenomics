import { getCurrentNetworkConfig } from '../calculations/config';

/**
 * Get the chain ID for the current network asynchronously
 * This integrates with the existing network configuration system
 * @returns Promise<string | null> The chain ID or null if not available
 */
export const getChainId = async (): Promise<string | null> => {
  try {
    const config = getCurrentNetworkConfig();
    if (!config) {
      console.warn('No network configuration available');
      return null;
    }
    
    if (!config.chainId) {
      console.warn('Chain ID not found in network configuration');
      return null;
    }
    
    return config.chainId;
  } catch (error) {
    console.error('Failed to get chain ID:', error);
    return null;
  }
};

/**
 * Get chain ID synchronously from the current network config
 * @returns string | null The chain ID or null if not available
 */
export const getChainIdSync = (): string | null => {
  try {
    const config = getCurrentNetworkConfig();
    if (!config) {
      console.warn('No network configuration available');
      return null;
    }
    
    if (!config.chainId) {
      console.warn('Chain ID not found in network configuration');
      return null;
    }
    
    return config.chainId;
  } catch (error) {
    console.error('Failed to get chain ID synchronously:', error);
    return null;
  }
}; 