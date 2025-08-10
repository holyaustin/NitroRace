// lib/useContracts.ts
import { useReadContract, useWriteContract } from 'wagmi';
import CarNFTABI from '../public/abi/CarNFT.json';
import RaceManagerABI from '../public/abi/RaceManager.json';

const CAR_NFT_ADDRESS = 'YOUR_CARNFT_ADDRESS'; // Replace
const RACE_MANAGER_ADDRESS = 'YOUR_RACEMANAGER_ADDRESS'; // Replace

export function useCarNFT() {
  return useReadContract({
    address: CAR_NFT_ADDRESS,
    abi: CarNFTABI,
  });
}

export function useRaceManager() {
  const { data: hash, writeContract } = useWriteContract();

  return {
    writeContract,
    raceManagerAddress: RACE_MANAGER_ADDRESS,
    raceManagerABI: RaceManagerABI,
    hash,
  };
}