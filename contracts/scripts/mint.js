// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokenURI =
  "https://bafybeibz2muftsdqar5oqzgcbyhd6eak7qignh4lmanefxx5r6zcjjct2e.ipfs.w3s.link/journey.json";

async function main() {
  const NexusNFT = await hre.ethers.getContractFactory("NexusNFT");

  const nexusNFT = await NexusNFT.attach(
    process.env.NFT_CONTRACT_ADDRESS // deployed contract address
  );

  console.log("NexusNFT attached to:", nexusNFT.address);

  console.log("Minting...");
  try {
    for (let i = 0; i < 8; i++) {
      const txn = await nexusNFT.mintWithTokenURI(
        "0x6B4583438C24839ea459e34e9F21aD419A846B0b",
        tokenURI
      );
      await txn.wait();
      await new Promise((r) => setTimeout(r, 5000));
      console.log("listing created for tokenId ", i);
    }
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
  }

  console.log("Minted!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
