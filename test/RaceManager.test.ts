import { expect } from "chai";
import { ethers } from "hardhat";

describe("RaceManager", function () {
  it("Should create race and let players join", async function () {
    const [owner, player1, player2] = await ethers.getSigners();

    const CarNFT = await ethers.getContractFactory("CarNFT");
    const carNFT = await CarNFT.deploy();
    await carNFT.waitForDeployment();

    const RaceManager = await ethers.getContractFactory("RaceManager");
    const raceManager = await RaceManager.deploy(await carNFT.getAddress());
    await raceManager.waitForDeployment();

    // Create race
    await raceManager.createRace(ethers.parseEther("0.01"));

    // Join race
    await raceManager.connect(player1).joinRace(0, { value: ethers.parseEther("0.01") });
    await raceManager.connect(player2).joinRace(0, { value: ethers.parseEther("0.01") });

    // Declare winner
    await raceManager.declareWinner(0, player1.address);

    // Claim prize
    await expect(() => raceManager.connect(player1).claimPrize(0))
      .to.changeEtherBalance(player1, ethers.parseEther("0.02"));

    // Cannot claim twice
    await expect(raceManager.connect(player1).claimPrize(0)).to.be.revertedWithCustomError(raceManager, "AlreadyClaimed");
  });
});