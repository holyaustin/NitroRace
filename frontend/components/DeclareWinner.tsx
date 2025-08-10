// components/DeclareWinner.tsx
'use client';

import { useState } from 'react';
import { useWriteContract } from 'wagmi';

export function DeclareWinner() {
  const [winner, setWinner] = useState('');
  const { writeContract, isPending } = useWriteContract();

  const handleSubmit = () => {
    writeContract({
      address: RACE_MANAGER_ADDRESS,
      abi: RaceManagerABI,
      functionName: 'declareWinner',
      args: [0, winner as `0x${string}`],
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">Declare Winner (Admin)</h2>
      <input
        type="text"
        placeholder="0x..."
        value={winner}
        onChange={(e) => setWinner(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Declare
      </button>
    </div>
  );
}