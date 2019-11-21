pragma solidity ^0.5.11;

import './Token.sol';

contract TokenSale{
    address payable admin;
    Token public tokenContract;
    uint256 public tokenPrice;
    uint public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(Token _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, 'requires stuff');
    }

    function buyTokens(uint _numberOfTokens) public payable {
        require(msg.value == multiply(_numberOfTokens, tokenPrice), "requires correct wei");

        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, 'requires sufficent tokens in contract');

        require(tokenContract.transfer(msg.sender, _numberOfTokens), "requires token transfer");

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin, 'requires admin');
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))), 'requires balance sent back to admin');
        selfdestruct(admin);
    }
}