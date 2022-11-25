const TronWeb = require("tronweb");

require("dotenv").config();

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
  privateKey: process.env.PRIVATE_KEY_SHASTA,
});

const newCollectionURI =
  "https://bafybeifni7gvpv2aja2kpwwev4yf2u3bmrq2qyvr3f2qynne4pagh7crua.ipfs.w3s.link/nexus.json";

async function main() {
  try {
    const nftContract = await tronWeb
      .contract()
      .at(process.env.NFT_CONTRACT_ADDRESS);

    const nftResult = await nftContract
      .setCollectionURI(newCollectionURI)
      .send({
        feeLimit: 100_000_000,
        callValue: 0,
        shouldPollResponse: false,
      });
    console.log("Txn hash: ", nftResult);
  } catch (e) {
    console.log(e);
  }
}

main();
