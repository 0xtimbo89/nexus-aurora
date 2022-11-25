// var NexusProtocol_v1 = artifacts.require("./NexusProtocol_v1.sol");
var TRC721Token = artifacts.require("./TRC721Token.sol");

module.exports = function (deployer) {
  // deployer.deploy(NexusProtocol_v1);
  deployer.deploy(TRC721Token);
};
