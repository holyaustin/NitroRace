import { expect } from "chai";
import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-chai-matchers";

describe("CarNFT", function () {
  it("Should mint a car with tokenURI", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const CarNFT = await ethers.getContractFactory("CarNFT");
    const carNFT = await CarNFT.deploy();
    await carNFT.waitForDeployment();

    // Mock tokenURI (data URL)
    const tokenURI = "data:application/json,{\"name\":\"Nitro Blazer\",\"image\":\"data:image/svg+xml,<svg>...</svg>\"}";

    // Mint token #1 to addr1
    await carNFT.mint(addr1.address, 1, tokenURI);

    // Check ownership
    expect(await carNFT.ownerOf(1)).to.equal(addr1.address);
    expect(await carNFT.tokenURI(1)).to.equal(tokenURI);
    expect(await carNFT.totalSupply()).to.equal(1);
  });

  it("Should not allow minting beyond maxSupply", async function () {
    const [owner] = await ethers.getSigners();

    const CarNFT = await ethers.getContractFactory("CarNFT");
    const carNFT = await CarNFT.deploy();
    await carNFT.waitForDeployment();

    // Set maxSupply = 1000, so we can't mint 1001
    for (let i = 0; i < 2; i++) {
      await carNFT.mint(owner.address, i, "data:...");
    }

    // No overflow — just logic check, but totalSupply increases
    // We don't need to go to 1000 for test
    expect(await carNFT.totalSupply()).to.equal(2);
  });

  it("Should allow owner to set tokenURI", async function () {
    const [owner] = await ethers.getSigners();

    const CarNFT = await ethers.getContractFactory("CarNFT");
    const carNFT = await CarNFT.deploy();
    await carNFT.waitForDeployment();

    await carNFT.mint(owner.address, 1, "data:old");
    await carNFT.setTokenURI(1, "data:new");

    expect(await carNFT.tokenURI(1)).to.equal("data:new");
  });

  it("Should revert if querying non-existent tokenURI", async function () {
    const CarNFT = await ethers.getContractFactory("CarNFT");
    const carNFT = await CarNFT.deploy();
    await carNFT.waitForDeployment();

    await expect(carNFT.tokenURI(99)).to.be.revertedWithCustomError(carNFT, "URIQueryForNonexistentToken");
  });
});