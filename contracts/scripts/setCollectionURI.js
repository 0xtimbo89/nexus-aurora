// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const collectionURI =
  "https://bafybeid76hfxrsh22d4ofp4o4qvwxntnvuxoh2akt4wgxvl7hyy6asyxie.ipfs.w3s.link/journey_collection.json";

async function main() {
  const NexusNFT = await hre.ethers.getContractFactory("NexusNFT");

  const nexusNFT = await NexusNFT.attach(
    process.env.NFT_CONTRACT_ADDRESS // deployed contract address
  );

  console.log("MyNFT attached to:", nexusNFT.address);

  console.log("Setting collection URI...");

  const res = await nexusNFT.setCollectionURI(collectionURI);

  console.log("Set!", res);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
