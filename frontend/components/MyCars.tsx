// components/MyCars.tsx
'use client';

import { useAccount, useReadContract } from 'wagmi';
import { CAR_NFT_ADDRESS } from '@/lib/addresses';
import CarNFTABI from '../public/abi/CarNFT.json';

export function MyCars() {
  const { address } = useAccount();

  const { data: balance } = useReadContract({
    address: CAR_NFT_ADDRESS,
    abi: CarNFTABI,
    functionName: 'balanceOf',
    args: [address],
  });

  const { data: tokens } = useReadContract({
    address: CAR_NFT_ADDRESS,
    abi: CarNFTABI,
    functionName: 'tokensOfOwner',
    args: [address],
    query: {
      enabled: !!address && !!balance && balance > 0,
    },
  });

  if (!address) return null;
  if (!balance || balance === 0n) return <p>You don’t own any cars.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Cars</h2>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: Number(balance) }).map((_, i) => (
          <div key={i} className="border rounded p-4">
            <p>Car #{Number(tokens?.[i] || 0)}</p>
            <button className="mt-2 px-3 py-1 bg-green-500 text-white text-sm rounded">
              Use in Race
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}