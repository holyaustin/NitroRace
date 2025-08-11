// lib/useContracts.ts
import { useReadContract, useWriteContract } from 'wagmi';
import CarNFTABI from '../lib/abi/CarNFT';
import RaceManagerABI from '../public/abi/RaceManager.json';

const CAR_NFT_ADDRESS = '0x084622e6970BBcBA510454C6145313c2993ED9E4'; // Replace
const RACE_MANAGER_ADDRESS = '0xA2Aea35523a71EFf81283E32F52151F12D5CBB7F'; // Replace

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