import { ethers } from "hardhat";

async function main() {
  const carNFTAddress = "REPLACE_WITH_CARNFT_ADDRESS"; // From deploy-car-nft output

  const RaceManager = await ethers.getContractFactory("RaceManager");
  const raceManager = await RaceManager.deploy(carNFTAddress);
  await raceManager.waitForDeployment();

  console.log("✅ RaceManager deployed to:", await raceManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});