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
      process.env.NEXUS_CONTRACT_ADDRESS // deployed contract address
    );

    console.log("MyNFT attached to:", nexus.address);

    console.log("Creating listing...");

    //   price: 0.001 ETH
    const res = await nexus.cancelListing(process.env.NFT_CONTRACT_ADDRESS, 2);

    console.log("listing created!", res);
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
