import { expect } from "chai";
import { ethers } from "hardhat";

describe("CarNFT", function () {
  it("Should deploy and own 5 NFTs", async function () {
    const CarNFT = await ethers.getContractFactory("CarNFT");
    const carNFT = await CarNFT.deploy();
    await carNFT.waitForDeployment();

    expect(await carNFT.totalSupply()).to.equal(5);

    const tokenURI = await carNFT.tokenURI(0);
    expect(tokenURI).to.include("Nitro Blazer");
    expect(tokenURI).to.include("Speed:90");
  });

  it("Should not allow invalid tokenId", async function () {
    const CarNFT = await ethers.getContractFactory("CarNFT");
    const carNFT = await CarNFT.deploy();
    await carNFT.waitForDeployment();

    await expect(carNFT.tokenURI(99)).to.be.reverted;
  });
});