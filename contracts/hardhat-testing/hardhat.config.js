require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const {
  GOERLI_API_URL,
  PRIVATE_KEY,
  PRIVATE_KEY2,
  ETHERSCAN_API_KEY,
  NEXUS_CONTRACT_ADDRESS,
  NFT_CONTRACT_ADDRESS,
} = process.env;

task("etherscan-verify", "Verifies on etherscan", async (taskArgs, hre) => {
  console.log("Verifying contract on etherscan...");
  await hre.run("verify:verify", {
    address: NEXUS_CONTRACT_ADDRESS,
    network: taskArgs["network"],
  });
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "goerli",
  networks: {
    goerli: {
      url: GOERLI_API_URL ?? "",
      accounts: [`0x${PRIVATE_KEY}`],
      gasPrice: 100000000000,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
      mainnet: ETHERSCAN_API_KEY,
    },
  },
};
