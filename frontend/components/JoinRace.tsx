// components/JoinRace.tsx
'use client';

import { useWriteContract } from 'wagmi';
import { RACE_MANAGER_ADDRESS } from '@/lib/addresses';
import RaceManagerABI from '../public/abi/RaceManager.json';

export function JoinRace() {
  const { writeContract, isPending } = useWriteContract();

  const handleJoin = () => {
    writeContract({
      address: RACE_MANAGER_ADDRESS,
      abi: RaceManagerABI,
      functionName: 'joinRace',
      args: [0], // raceId
      value: BigInt('10000000000000000'), // 0.01 ETH
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">Join Race</h2>
      <button
        onClick={handleJoin}
        disabled={isPending}
        className="mt-2 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {isPending ? 'Confirming...' : 'Join Race (0.01 ETH)'}
      </button>
    </div>
  );
}