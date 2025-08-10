import { ethers } from "hardhat";

async function main() {
  // Replace with actual CarNFT address after deploying it
  const carNFTAddress = "0x084622e6970BBcBA510454C6145313c2993ED9E4"; // ← Change this!

  const RaceManager = await ethers.getContractFactory("RaceManager");
  const raceManager = await RaceManager.deploy(carNFTAddress);
  await raceManager.waitForDeployment();

  console.log("✅ RaceManager deployed to:", await raceManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});