// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  try {
    const NexusProtocol = await hre.ethers.getContractFactory("NexusProtocol");

    const nexus = await NexusProtocol.attach(
      process.env.CONTRACT_ADDRESS // deployed contract address
    );

    console.log("MyNFT attached to:", nexus.address);

    console.log("Fulfilling listing...");

    //   price: 0.001 ETH
    const res = await nexus.fulfillListing(
      "0x6a47f91b792A89858D4dd1fc6a59cfF5b89bE276",
      1,
      { value: 1000000000000000 }
    );

    console.log("listing fulfilled!", res);
  } catch (err) {
    console.log(err.message);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
