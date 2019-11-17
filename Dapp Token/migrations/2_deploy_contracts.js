const Token = artifacts.require("../contracts/Token.sol");

module.exports = function(deployer) {
  deployer.deploy(Token, 1000000);
};
