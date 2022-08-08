import { ethers } from "hardhat"
import { IWeth } from "../typechain-types"

const getWeth = async () => {
  const [deployer] = await ethers.getSigners()
  const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  const weth = (await ethers.getContractAt("IWeth", wethAddress)) as IWeth
  const tx = await weth.deposit({ value: ethers.utils.parseEther("1") })
  const txReceipt = await tx.wait()
  console.log("txReceipt", txReceipt)
  const balaceOfWeth = await weth.balanceOf(deployer.address)
  console.log("balance ", ethers.utils.formatEther(balaceOfWeth))
}

export default getWeth
