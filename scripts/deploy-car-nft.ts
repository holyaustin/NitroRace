import { ethers } from "hardhat";

async function main() {
  const CarNFT = await ethers.getContractFactory("CarNFT");
  const carNFT = await CarNFT.deploy();
  await carNFT.waitForDeployment();

  console.log("✅ CarNFT deployed to:", await carNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});