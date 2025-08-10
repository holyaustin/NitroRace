import { expect } from "chai";
import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-chai-matchers";

// ✅ Remove: import { describe, it } from "node:test";
// Mocha's `describe` and `it` are globally available in Hardhat

describe("RaceManager", function () {
  it("Should create race, let players join, and pay winner", async function () {
    const [owner, player1, player2] = await ethers.getSigners();

    // Deploy CarNFT
    const CarNFT = await ethers.getContractFactory("CarNFT");
    const carNFT = await CarNFT.deploy();
    await carNFT.waitForDeployment();

    // Deploy RaceManager
    const RaceManager = await ethers.getContractFactory("RaceManager");
    const raceManager = await RaceManager.deploy(await carNFT.getAddress());
    await raceManager.waitForDeployment();

    // Create race
    await raceManager.createRace(ethers.parseEther("0.01"));

    // Players join
    await raceManager.connect(player1).joinRace(0, { value: ethers.parseEther("0.01") });
    await raceManager.connect(player2).joinRace(0, { value: ethers.parseEther("0.01") });

    // Declare winner
    await raceManager.declareWinner(0, player1.address);

    // Claim prize
    await expect(() => raceManager.connect(player1).claimPrize(0))
      .to.changeEtherBalance(player1, ethers.parseEther("0.02"));

    // Cannot claim twice
    await expect(raceManager.connect(player1).claimPrize(0))
      .to.be.revertedWithCustomError(raceManager, "AlreadyClaimed");
  });

  it("Should not allow join with incorrect value", async function () {
    const [owner] = await ethers.getSigners();

    const CarNFT = await ethers.getContractFactory("CarNFT");
    const carNFT = await CarNFT.deploy();
    await carNFT.waitForDeployment();

    const RaceManager = await ethers.getContractFactory("RaceManager");
    const raceManager = await RaceManager.deploy(await carNFT.getAddress());
    await raceManager.waitForDeployment();

    await raceManager.createRace(ethers.parseEther("0.01"));

    await expect(
      raceManager.joinRace(0, { value: ethers.parseEther("0.001") })
    ).to.be.revertedWithCustomError(raceManager, "InsufficientValue");
  });

  it("Should only allow owner to declare winner", async function () {
    const [owner, player1, player2] = await ethers.getSigners();

    const CarNFT = await ethers.getContractFactory("CarNFT");
    const carNFT = await CarNFT.deploy();
    await carNFT.waitForDeployment();

    const RaceManager = await ethers.getContractFactory("RaceManager");
    const raceManager = await RaceManager.deploy(await carNFT.getAddress());
    await raceManager.waitForDeployment();

    await raceManager.createRace(ethers.parseEther("0.01"));
    await raceManager.connect(player1).joinRace(0, { value: ethers.parseEther("0.01") });

    await expect(
      raceManager.connect(player2).declareWinner(0, player1.address)
    ).to.be.revertedWithCustomError(raceManager, "NotOwner");
  });
});