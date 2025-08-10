# 🏎️ NitroRace – Blockchain-Powered Racing 

> **Race. Bet. Win. On-chain.**

NitroRace is a fast-paced, Web3-powered 2D racing game where players:
- Connect wallet
- Enter races using test tokens
- Bet on winners
- Watch payouts settle **transparently on-chain**

Built for hackathons, demos, and blockchain education — NitroRace combines **smart contracts**, **NFTs**, **on-chain betting**, and **real-time game logic** in a clean, visual, and auditable way.

🏁 **Live Demo** | 🔗 [Coming Soon]  
📊 **Contract Verified** | ✅ Yes  
🪙 **Chain** | Ethereum Sepolia / Somnia / Any EVM  
🔧 **Built with** Hardhat, React, ethers.js, Web3Modal

---

## 🎯 Features

- ✅ **Wallet Connect**: MetaMask & WalletConnect support
- 🏅 **On-chain Race Logic**: Join, race, win — all tracked in Solidity
- 💸 **Token Entry Fee**: Pay with ERC-20 (e.g., $RACE token)
- 🏆 **Winner Payouts**: 90% prize pool, 10% house fee — auto-distributed
- 📊 **Live Leaderboard**: Real-time race results
- 🧪 **Tested & Verified**: Full Hardhat suite + contract verification
- 🎨 **Visual 2D Race UI**: Simple animation for demo impact

---

## 🚀 Demo Flow

1. **User connects wallet** → sees their NFT racer
2. **Joins a race** → pays 10 $RACE tokens
3. **Race starts automatically at 2 players**
4. **Owner (or oracle) declares winner**
5. **Smart contract sends prize on-chain**
6. **User claims payout instantly**

> “Watch two players race, bet on the winner, see the payout transaction live.”

---

## 🧰 Tech Stack

| Layer       | Technology |
|------------|------------|
| **Smart Contract** | Solidity, Hardhat, OpenZeppelin |
| **Testing**        | Mocha, Chai, Hardhat Network |
| **Frontend**       | React + TypeScript |
| **Wallet**         | Web3Modal, ethers.js |
| **Deployment**     | Hardhat, @nomicfoundation/hardhat-verify |
| **Chain**          | EVM-compatible (Sepolia, Somnia, etc.) |

---

## 📦 Installation

### 1. Clone the repo
```bash
git clone https://github.com/your-username/nitrorace.git
cd nitrorace
```

### 2. Install dependencies
```bash
# Install backend (Hardhat)
cd blockchain
npm install

# Install frontend
cd ../frontend
npm install
```

### 3. Set up environment
Create `.env` in `blockchain/`:
```env
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_or_explorer_key
```

> ⚠️ Never commit `.env`! Added to `.gitignore`.

---

## 🛠️ Compile & Deploy

### 1. Compile contracts
```bash
cd blockchain
npx hardhat compile
```

### 2. Deploy to local or testnet
```bash
# Local network (for testing)
npx hardhat run scripts/deploy.ts

# Or: Deploy to Sepolia/Somnia
npx hardhat run scripts/deploy.ts --network somnia
```

Output:
```
Token deployed to:  0x...
RaceGame deployed to: 0x...
```

Save the addresses — you’ll need them in the frontend.

---

## 🖼️ Frontend Setup

Update contract addresses in `frontend/src/config.ts`:
```ts
export const CONTRACT_ADDRESSES = {
  raceGame: "0x...",
  raceToken: "0x..."
};
```

Start dev server:
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ Testing

Run full test suite:
```bash
cd blockchain
npx hardhat test
```

Expected:
```
  RaceGame
    ✓ Should allow players to join race (452ms)
    ✓ Should pay winner 90% of prize pool (612ms)

  2 passing (1s)
```

---

## 🔍 Verify Contracts

Verify on Etherscan or custom explorer:
```bash
npx hardhat verify --network somnia DEPLOYED_RACE_GAME_ADDRESS "TOKEN_ADDRESS" 10
```

Example:
```bash
npx hardhat verify --network somnia 0x1234...5678 0x8765...4321 10
```

---

## 🏁 Project Structure

```
nitrorace/
│
├── blockchain/               # Hardhat project
│   ├── contracts/            # Solidity: RaceGame.sol, MockERC20.sol
│   ├── scripts/deploy.ts     # Deploys token + race contract
│   ├── test/                 # Unit tests
│   ├── hardhat.config.ts     # Config with etherscan support
│   └── ...
│
├── frontend/                 # React dApp
│   ├── public/car.png        # NFT car image
│   ├── src/
│   │   ├── App.tsx           # Wallet connect + race UI
│   │   ├── config.ts         # Contract addresses
│   │   └── ...
│   └── ...
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 📜 License

MIT License. Free to use, modify, and showcase in hackathons.

---

## 🧑‍🚀 Maintainer

@your-github-username  
Built during [Hackathon Name] 2024

---

## 🙌 Acknowledgments

- [Hardhat](https://hardhat.org) – Dev environment  
- [Web3Modal](https://web3modal.com) – Wallet connection  
- [OpenZeppelin](https://openzeppelin.com) – Secure contracts  
- [Ethers.js](https://docs.ethers.org) – Ethereum JS library  

---

## 🚀 Future Ideas

- Add **random winner** via Chainlink VRF  
- Support **NFT racers** with traits (speed, luck)  
- Multiplayer races (4+ players)  
- Decentralized betting: let users bet on races  
- On-chain race animation seed

---

🔥 **NitroRace: Where every race settles on-chain. No takebacks.**



