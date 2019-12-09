const ethers = require("ethers");

let mnemonicWallet = ethers.Wallet.fromMnemonic(
  "blame stumble network chapter sunny cherry lecture collect quiz aim trip junk"
);

// console.log(mnemonicWallet);

let path = "http://127.0.0.1:8545";

let customProvider = new ethers.providers.JsonRpcProvider(path);

let pKey = mnemonicWallet.signingKey.keyPair.privateKey;

let address = mnemonicWallet.signingKey.address;

console.log(address, pKey);

// not sure what this one does. think it connects exisiting wallet to custom network
// wallet = new ethers.Wallet(, customProvider);
