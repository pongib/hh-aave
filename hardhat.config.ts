import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-deploy"
import "dotenv/config"

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.8.9" },
      { version: "0.4.19" },
      { version: "0.6.12" },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.FORK_URL!,
        blockNumber: 15306831,
      },
    },
  },
}

export default config
