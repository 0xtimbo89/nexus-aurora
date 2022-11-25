const TronWeb = require("tronweb");

require("dotenv").config();

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
  privateKey: process.env.PRIVATE_KEY_SHASTA,
});

async function main() {
  try {
    const result = await createListing();
    // console.log("result: ", result);
  } catch (e) {
    console.log(e);
  }
}

async function createListing() {
  try {
    const nexusProtocol = await tronWeb
      .contract()
      .at(process.env.NEXUS_CONTRACT_ADDRESS);

    for (let i = 1; i <= 5; i++) {
      const txn = await nexusProtocol
        .createListing(process.env.NFT_CONTRACT_ADDRESS, i, 150000000)
        .send({
          feeLimit: 100_000_000,
          callValue: 0,
          shouldPollResponse: false,
        });

      console.log(`https://shasta.tronscan.org/#/transaction/${txn}`);
    }
  } catch (e) {
    console.log(e);
  }
}

main();
