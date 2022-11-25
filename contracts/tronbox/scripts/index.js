const TronWeb = require("tronweb");

require("dotenv").config();

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
  privateKey: process.env.PRIVATE_KEY_SHASTA,
});

const tokenURI = [
  "https://bafybeid4ppp6fhjsjp35bnhrwmdjydrrfdtullcy2pmbzyunuthi4aiaoa.ipfs.w3s.link/1.json",
  "https://bafybeigv7yma2o2kzgcf3dlgwdkqzxrj23lqa7rqbkbxqnmle24plba5xa.ipfs.w3s.link/2.json",
  "https://bafybeicnl7y5qelnmaafvl4wvuunmxakotor4k33awdgn55qcw2wmcyufm.ipfs.w3s.link/3.json",
  "https://bafybeicskeoewqoxsk76tcn5ltjzxttldtmgr4sluoivdyjpfbkuswfnlq.ipfs.w3s.link/4.json",
  "https://bafybeibxozh3el3ovadendfm6dypdjhurlemrakv7y2eusddamvf444je4.ipfs.w3s.link/5.json",
  "https://bafybeid4lczpe3sfxn5udgxwgtcbbaksgyjvryigmd5v5i64eeo3uoqs4a.ipfs.w3s.link/6.json",
  "https://bafybeiercgm5izdbv2d7pqxl4wnz4fj6hsn6mycaqibom5uzyvbyo4rj3y.ipfs.w3s.link/7.json",
  "https://bafybeiafktdujc7bhrdmf25a76aef6yuvi3czc5peu4qyxnfi2kfdxveba.ipfs.w3s.link/8.json",
  "https://bafybeibdpsk3npjfwpbiroa4ckymw4bwraaozqeflduv34m2qehxp52eqe.ipfs.w3s.link/9.json",
  "https://bafybeifucystmc6bff3szztknxq2appmksihqhjbjqfnhvgnb3xbfzkojm.ipfs.w3s.link/10.json",
];

async function main() {
  try {
    const nftContract = await tronWeb
      .contract()
      .at(process.env.NFT_CONTRACT_ADDRESS);

    for (let i = 0; i < tokenURI.length; i++) {
      const nftResult = await nftContract
        .mintWithTokenURI(process.env.MY_ADDRESS, tokenURI[i])
        .send({
          feeLimit: 100_000_000,
          callValue: 0,
          shouldPollResponse: false,
        });
      console.log("Txn hash: ", nftResult);
    }
  } catch (e) {
    console.log(e);
  }
}

main();
