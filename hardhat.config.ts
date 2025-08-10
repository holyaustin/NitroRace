import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import '@nomicfoundation/hardhat-ethers';
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter";
import dotenv from "dotenv";
dotenv.config();


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    somnia: {
      url: "https://dream-rpc.somnia.network/",
      accounts: [process.env.PRIVATE_KEY!],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
  etherscan: {
    apiKey: {
      somnia: "abc123", // placeholder
    },
    customChains: [
      {
        network: "somnia",
        chainId: 65010,
        urls: {
          apiURL: "https://somnia-testnet-explorer.dora.so/api",
          browserURL: "https://somnia-testnet-explorer.dora.so",
        },
      },
    ],
  },
};

export default config;