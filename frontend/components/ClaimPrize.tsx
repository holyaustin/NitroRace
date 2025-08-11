// components/ClaimPrize.tsx
'use client';

import { useWriteContract } from 'wagmi';
import { RACE_MANAGER_ADDRESS } from '@/lib/addresses';
import raceManagerABI from '@/lib/abi/RaceManager';

export function ClaimPrize() {
  const { writeContract, isPending } = useWriteContract();

  const claim = () => {
    writeContract({
      address: RACE_MANAGER_ADDRESS,
      abi: raceManagerABI,
      functionName: 'claimPrize',
      args: [0], // raceId
    });
  };

  return (
    <div className="mt-6 text-center">
      <button
        onClick={claim}
        disabled={isPending}
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {isPending ? 'Claiming...' : '💰 Claim 0.02 ETH Prize'}
      </button>
    </div>
  );
}