import { ethers } from "hardhat"
import { IWeth } from "../typechain-types"

const amount = ethers.utils.parseEther("1")

export const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

const getWeth = async () => {
  const [deployer] = await ethers.getSigners()
  const weth: IWeth = await ethers.getContractAt("IWeth", wethAddress)
  const tx = await weth.deposit({ value: amount })
  const txReceipt = await tx.wait()
  console.log("txReceipt", txReceipt)
  const balaceOfWeth = await weth.balanceOf(deployer.address)
  console.log("balance weth", ethers.utils.formatEther(balaceOfWeth))
}

export default getWeth
export { amount }
