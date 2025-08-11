// src/lib/wagmiConfig.ts
import { createConfig, http } from 'wagmi'
import { somnia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Extend wagmi chains with Somnia
export const somniaChain = {
  id: 65010,
  name: 'Somnia Testnet',
  network: 'somnia-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'SOMN',
    symbol: 'SOMN',
  },
  rpcUrls: {
    default: { http: ['https://somnia-testnet-rpc.dora.so'] },
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