const Token = artifacts.require("../contracts/Token.sol");
const TokenSale = artifacts.require("../contracts/TokenSale.sol");

contract("TokenSale", accounts => {
  var tokenSaleInstance;
  var tokenInstance;
  var admin = accounts[0];
  var buyer = accounts[1];
  var tokenPrice = 1000000000000000;
  var tokensAvailable = 750000000;
  var numberOfTokens;

  it("initializes the contract with the correct vales", () => {
    return TokenSale.deployed()
      .then(instnace => {
        tokenSaleInstance = instnace;
        return tokenSaleInstance.accounts;
      })
      .then(address => {
        assert.notEqual(address, 0x0, "has contract address");
        return tokenSaleInstance.tokenContract();
      })
      .then(address => {
        assert.notEqual(address, 0x0, "has token contract address");
        return tokenSaleInstance.tokenPrice();
      })
      .then(price => {
        assert.equal(price, tokenPrice, "token price is correct");
      });
  });

  it("facilitates token buying", function() {
    return Token.deployed()
      .then(function(instance) {
        // Grab token instance first
        tokenInstance = instance;
        return TokenSale.deployed();
      })
      .then(function(instance) {
        // Then grab token sale instance
        tokenSaleInstance = instance;
        // Provision 75% of all tokens to the token sale
        return tokenInstance.transfer(
          tokenSaleInstance.address,
          tokensAvailable,
          { from: admin }
        );
      })
      .then(function(receipt) {
        numberOfTokens = 10;
        return tokenSaleInstance.buyTokens(numberOfTokens, {
          from: buyer,
          value: numberOfTokens * tokenPrice
        });
      })
      .then(function(receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "Sell",
          'should be the "Sell" event'
        );
        assert.equal(
          receipt.logs[0].args._buyer,
          buyer,
          "logs the account that purchased the tokens"
        );
        assert.equal(
          receipt.logs[0].args._amount,
          numberOfTokens,
          "logs the number of tokens purchased"
        );
        return tokenSaleInstance.tokensSold();
      })
      .then(function(amount) {
        assert.equal(
          amount.toNumber(),
          numberOfTokens,
          "increments the number of tokens sold"
        );
        return tokenInstance.balanceOf(buyer);
      })
      .then(function(balance) {
        assert.equal(balance.toNumber(), numberOfTokens);
        return tokenInstance.balanceOf(tokenSaleInstance.address);
      })
      .then(function(balance) {
        assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
        // Try to buy tokens different from the ether value
        return tokenSaleInstance.buyTokens(numberOfTokens, {
          from: buyer,
          value: 1
        });
      })
      .then(assert.fail)
      .catch(function(error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "msg.value must equal number of tokens in wei"
        );
        return tokenSaleInstance.buyTokens(800000000, {
          from: buyer,
          value: numberOfTokens * tokenPrice
        });
      })
      .then(assert.fail)
      .catch(function(error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "cannot purchase more tokens than available"
        );
      });
  });

  it("ends token sale", () => {
    return Token.deployed()
      .then(instance => {
        tokenInstance = instance;
        return TokenSale.deployed();
      })
      .then(instance => {
        tokenSaleInstance = instance;
        return tokenSaleInstance.endSale({ from: buyer });
      })
      .then(assert.fail)
      .catch(error => {
        assert(
          error.message.indexOf("revert" >= 0, "must be admin to end sale")
        );
        return tokenSaleInstance.endSale({ from: admin });
      })
      .then(receipt => {
        return tokenInstance.balanceOf(admin);
      })
      .then(balance => {
        assert.equal(
          balance.toNumber(),
          999999990,
          "returns all unsold tokens to admin"
        );
      });
  });
});
