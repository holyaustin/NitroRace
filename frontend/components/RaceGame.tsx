// components/RaceGame.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { RACE_MANAGER_ADDRESS } from '@/lib/addresses';
import raceManagerABI from '@/lib/abi/RaceManager';
import { ClaimPrize } from './ClaimPrize'; // ✅ Import here, not in ClaimPrize

const PLAYER_COLORS = ['red', 'blue'];

const TOTAL_DISTANCE = 700;

export function RaceGame() {
  const { address } = useAccount();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [positions, setPositions] = useState<number[]>([0, 0]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [raceId] = useState(0);

  const { writeContract, isPending: isDeclaring } = useWriteContract();

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.canvas.width = 800;
    ctx.canvas.height = 200;

    let animationId: number;
    let speeds = [0, 0];
    let finished = [false, false];
    let finishOrder: number[] = [];

    const animate = () => {
      ctx.clearRect(0, 0, 800, 200);

      // Draw track
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(0, 100);
      ctx.lineTo(800, 100);
      ctx.stroke();

      positions.forEach((pos, i) => {
        if (!finished[i]) {
          speeds[i] = (speeds[i] || 2) + (Math.random() - 0.5) * 0.5;
          speeds[i] = Math.max(1.5, Math.min(4, speeds[i]));

          const newPos = pos + speeds[i];
          setPositions((prev) => {
            const updated = [...prev];
            updated[i] = newPos;
            return updated;
          });

          if (newPos >= TOTAL_DISTANCE) {
            finished[i] = true;
            finishOrder.push(i);
            if (finishOrder.length === 2) {
              const winnerIndex = finishOrder[0];
              setWinner(winnerIndex);
              setGameOver(true);
            }
          }
        }
      });

      // Draw cars
      positions.forEach((pos, i) => {
        ctx.fillStyle = PLAYER_COLORS[i];
        ctx.fillRect(pos, 80, 30, 40);
        ctx.fillStyle = 'white';
        ctx.font = '12px sans-serif';
        ctx.fillText(`P${i + 1}`, pos + 8, 75);
      });

      if (!gameOver) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [gameOver]);

  const declareWinner = () => {
    if (winner === null || isDeclaring) return;

    writeContract({
      address: RACE_MANAGER_ADDRESS,
      abi: raceManagerABI,
      functionName: 'declareWinner',
      args: [raceId, address],
    });
  };

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-3xl font-bold mb-4">🏁 Race in Progress</h2>
      <canvas ref={canvasRef} className="border-2 border-gray-600 rounded bg-black" />

      {gameOver && (
        <div className="mt-6 text-center">
          <p className="text-2xl text-green-400 font-bold">
            You {winner === 0 ? 'WON!' : 'lost...'} 🎉
          </p>
          {!isDeclaring && <ClaimPrize />}
        </div>
      )}
    </div>
  );
}