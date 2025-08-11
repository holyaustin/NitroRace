// src/lib/wagmiConfig.ts
import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';

// Define Somnia Testnet manually
export const somniaChain = {
  id: 65010,
  name: 'Somnia Testnet',
  network: 'somnia-testnet',
  nativeCurrency: {
    name: 'SOMN',
    symbol: 'SOMN',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://somnia-testnet-rpc.dora.so'], // ✅ Official RPC
    },
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: 'https://somnia-testnet-explorer.dora.so',
    },
  },
  testnet: true,
} as const;

export const config = createConfig({
  chains: [somniaChain],
  connectors: [
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [somniaChain.id]: http(),
  },
});