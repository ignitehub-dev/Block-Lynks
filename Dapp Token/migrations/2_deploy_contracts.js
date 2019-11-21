const Token = artifacts.require("../contracts/Token.sol");
const TokenSale = artifacts.require("../contracts/TokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(Token, 1000000000).then(() => {
    var tokenPrice = 1000000000000000;
    return deployer.deploy(TokenSale, Token.address, tokenPrice);
  });
};
