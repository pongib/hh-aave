import { BigNumberish, Signer } from "ethers"
import { ethers } from "hardhat"
import {
  IERC20,
  ILendingPool,
  ILendingPoolAddressesProvider,
} from "../typechain-types"
import { amount, wethAddress, default as getWeth } from "./getWeth"

const main = async () => {
  const [deployer] = await ethers.getSigners()
  await getWeth()
  const lendingPool = await getLendingPool()
  console.log(lendingPool.address)

  // approve before deposit to contract
  await approveErc20(wethAddress, lendingPool.address, amount, deployer)
  console.log("Approve")

  // deposit
  await lendingPool.deposit(wethAddress, amount, deployer.address, 0)
  console.log("Deposit")
}

const getLendingPool = async () => {
  // lending pool address from LendingPoolAddressesProvider and call get funciton
  const addressProvider: ILendingPoolAddressesProvider =
    await ethers.getContractAt(
      "ILendingPoolAddressesProvider",
      "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5"
    )
  const lendingPoolAddress = await addressProvider.getLendingPool()

  const lendingPool: ILendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress
  )
  return lendingPool
}

const approveErc20 = async (
  erc20Address: string,
  spender: string,
  amount: BigNumberish,
  account: Signer
) => {
  const erc20: IERC20 = await ethers.getContractAt(
    "IERC20",
    erc20Address,
    account
  )

  const tx = await erc20.approve(spender, amount)
  await tx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
