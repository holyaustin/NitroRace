// app/providers/WagmiProvider.tsx
'use client';

import { PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmiConfig';

export function WagmiProviderWrapper({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  );
}