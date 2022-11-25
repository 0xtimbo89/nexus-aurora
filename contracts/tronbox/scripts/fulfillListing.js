const TronWeb = require("tronweb");

require("dotenv").config();

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
  privateKey: process.env.PRIVATE_KEY_SHASTA2,
});

async function main() {
  try {
    const result = await fulfillListing();
    console.log("result: ", result);
  } catch (e) {
    console.log(e);
  }
}

async function fulfillListing() {
  try {
    const nexusProtocol = await tronWeb
      .contract()
      .at(process.env.NEXUS_CONTRACT_ADDRESS);

    const fulfillmentResult = await nexusProtocol
      .fulfillListing(process.env.NFT_CONTRACT_ADDRESS, 1)
      .send({
        feeLimit: 100_000_000,
        callValue: 1000000,
        shouldPollResponse: false,
      });

    console.log(fulfillmentResult);
    return fulfillmentResult;
  } catch (e) {
    console.log(e);
  }
}

main();
