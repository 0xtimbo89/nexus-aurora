const TronWeb = require("tronweb");

require("dotenv").config();

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
  privateKey: process.env.PRIVATE_KEY_SHASTA2,
});

async function main() {
  try {
    const result = await hasActiveListing();
    console.log("result: ", result);
  } catch (e) {
    console.log(e);
  }
}

async function hasActiveListing() {
  try {
    const nexusProtocol = await tronWeb
      .contract()
      .at(process.env.NEXUS_CONTRACT_ADDRESS);

    const hasListingResult = await nexusProtocol
      .hasActiveListing(process.env.NFT_CONTRACT_ADDRESS, 1)
      .call();

    console.log(hasListingResult);
    return hasListingResult;
  } catch (e) {
    console.log(e);
  }
}

main();
