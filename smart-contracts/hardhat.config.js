require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "csc",
  networks: {
    csc: {
      url: "https://testnet-rpc.coinex.net/",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 53,
    },
  },
};
