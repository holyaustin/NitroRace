import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify"; 
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    somnia: {
      url: "https://somnia-testnet-rpc.dora.so", // Official RPC
      accounts: [process.env.PRIVATE_KEY!], // Your wallet private key
    },
  },
  etherscan: {
    apiKey: {
      somnia: "YOUR_ETHERSCAN_API_KEY", // Optional for verification
    },
    customChains: [
      {
        network: "somnia",
        chainId: 65010, // Somnia Testnet Chain ID
        urls: {
          apiURL: "https://somnia-testnet-explorer.dora.so/api",
          browserURL: "https://somnia-testnet-explorer.dora.so",
        },
      },
    ],
  },
};

export default config;