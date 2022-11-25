const TronWeb = require("tronweb");

require("dotenv").config();

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
  privateKey: process.env.PRIVATE_KEY_SHASTA,
});

async function main() {
  try {
    const nftContract = await tronWeb
      .contract()
      .at(process.env.NFT_CONTRACT_ADDRESS);

    // for (let i = 1; i <= 16; i++) {
    const nftResult = await nftContract
      .mintWithTokenURI(process.env.MY_ADDRESS, process.env.TOKEN_URI)
      .send({
        feeLimit: 100_000_000,
        callValue: 0,
        shouldPollResponse: false,
      });
    console.log("Txn hash: ", nftResult);
    // }
  } catch (e) {
    console.log(e);
  }
}

main();
