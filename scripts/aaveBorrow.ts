import getWeth from "./getWeth"

const main = async () => {
  await getWeth()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
