// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");

  const myNFT = await MyNFT.attach(
    process.env.NFT_CONTRACT_ADDRESS // deployed contract address
  );

  console.log("MyNFT attached to:", myNFT.address);

  console.log("Minting...");

  const res = await myNFT.mintNFT(
    "0x6B4583438C24839ea459e34e9F21aD419A846B0b",
    "https://bafybeibl7f5iijvv3gjis6ibkqn67dmfo6jb2lhelfa5lb74d3q5io25lq.ipfs.w3s.link/fighter.json"
  );

  console.log("Minted!", res);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
