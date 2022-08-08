import { ethers } from "hardhat"
import { ILendingPoolAddressesProvider } from "../typechain-types"
import getWeth from "./getWeth"

const main = async () => {
  // await getWeth()
  await getLendingPoolAddress()
  // lending pool address from LendingPoolAddressesProvider and call get funciton
}

const getLendingPoolAddress = async () => {
  const contract = (await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5"
  )) as ILendingPoolAddressesProvider
  const lendingPoolAddress = await contract.getLendingPool()
  console.log(lendingPoolAddress)
  return lendingPoolAddress
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
