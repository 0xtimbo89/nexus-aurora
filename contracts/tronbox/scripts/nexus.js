const TronWeb = require("tronweb");

require("dotenv").config();

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
  privateKey: process.env.PRIVATE_KEY_SHASTA2,
});

async function main() {
  try {
    const result = await cancelListing();
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
  } catch (e) {
    console.log(e);
  }
}

async function cancelListing() {
  try {
    const nexusProtocol = await tronWeb
      .contract()
      .at(process.env.NEXUS_CONTRACT_ADDRESS);

    const cancelResult = await nexusProtocol
      .cancelListing(process.env.NFT_CONTRACT_ADDRESS, 1)
      .send({
        feeLimit: 100_000_000,
        callValue: 0,
        shouldPollResponse: false,
      });

    console.log(cancelResult);
  } catch (e) {
    console.log(e);
  }
}

async function createListing() {
  try {
    const nexusProtocol = await tronWeb
      .contract()
      .at(process.env.NEXUS_CONTRACT_ADDRESS);

    const listingResult = await nexusProtocol
      .createListing(process.env.NFT_CONTRACT_ADDRESS, 1, 1000000)
      .send({
        feeLimit: 100_000_000,
        callValue: 0,
        shouldPollResponse: false,
      });

    console.log(listingResult);
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
  } catch (e) {
    console.log(e);
  }
}

main();
