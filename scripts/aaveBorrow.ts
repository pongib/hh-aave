import { BigNumberish, Signer } from "ethers"
import { ethers, getNamedAccounts } from "hardhat"
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

  // get data before calculate borrow
  const { availableBorrowsETH, totalDebtETH } = await getBorrowData(
    deployer.address,
    lendingPool
  )
  const daiPriceAddress = "0x773616E4d11A78F511299002da57A0a94577F1f4"
  // get price before borrow
  const daiPrice = await getPriceData(daiPriceAddress)

  // amount to borrow
  const amountDaiToBorrow = availableBorrowsETH.div(daiPrice).mul(8).div(10) // *0.8 for not in risk
  const amountDaiToBorrowInWei = ethers.utils.parseUnits(
    amountDaiToBorrow.toString(),
    18 // same as parseEther
  )
  // borrow
  const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
  await borrowAssest(
    daiAddress,
    lendingPool,
    amountDaiToBorrowInWei,
    deployer.address
  )

  await getBorrowData(deployer.address, lendingPool)
}

const borrowAssest = async (
  assetAddress: string,
  lendingPool: ILendingPool,
  amount: BigNumberish,
  account: string
) => {
  await lendingPool.borrow(assetAddress, amount, 1, 0, account)
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

const getBorrowData = async (
  userAddress: string,
  lendingPool: ILendingPool
) => {
  const {
    totalCollateralETH,
    totalDebtETH,
    availableBorrowsETH,
    currentLiquidationThreshold,
    ltv,
    healthFactor,
  } = await lendingPool.getUserAccountData(userAddress)
  console.log(`
    Total Collateral in ETH ${ethers.utils.formatEther(totalCollateralETH)}
    Total Debt in ETH ${ethers.utils.formatEther(totalDebtETH)}
    Avaliable to borrow in ETH ${ethers.utils.formatEther(availableBorrowsETH)}
    Liquidation Threshold ${currentLiquidationThreshold}
    ltv ${ltv}
    Health Factor ${ethers.utils.formatEther(healthFactor)}
  `)

  return { totalDebtETH, availableBorrowsETH, currentLiquidationThreshold }
}

const getPriceData = async (priceAddress: string) => {
  const priceFeed = await ethers.getContractAt("IAggregatorV3", priceAddress)
  const [, answer] = await priceFeed.latestRoundData()
  const decimals = await priceFeed.decimals()
  console.log("decimals", decimals)
  console.log(answer.toString())
  console.log(
    `DAI/ETH price is ${ethers.utils.formatUnits(answer.toString(), decimals)}`
  )
  return answer
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
