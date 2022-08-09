import { ethers } from "hardhat"
import { ILendingPoolAddressesProvider } from "../typechain-types"
import getWeth from "./getWeth"

const main = async () => {
  // await getWeth()
  await getLendingPool()
  // lending pool address from LendingPoolAddressesProvider and call get funciton
}

const getLendingPool = async () => {
  const addressProvider: ILendingPoolAddressesProvider =
    await ethers.getContractAt(
      "ILendingPoolAddressesProvider",
      "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5"
    )
  const lendingPoolAddress = await addressProvider.getLendingPool()

  const lendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress
  )
  return lendingPool
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
