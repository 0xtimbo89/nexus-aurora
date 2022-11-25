const TronWeb = require("tronweb");

require("dotenv").config();

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
  privateKey: process.env.PRIVATE_KEY_SHASTA,
});

async function main() {
  try {
    const result = await setApprovalForAll();
    console.log("result: ", result);
  } catch (e) {
    console.log(e);
  }
}

async function setApprovalForAll() {
  try {
    const nft = await tronWeb.contract().at(process.env.NFT_CONTRACT_ADDRESS);

    const approvalResult = await nft
      .setApprovalForAll(process.env.NEXUS_CONTRACT_ADDRESS, true)
      .send({
        feeLimit: 100_000_000,
        callValue: 0,
        shouldPollResponse: false,
      });

    console.log(approvalResult);
    return approvalResult;
  } catch (e) {
    console.log(e);
  }
}

main();
