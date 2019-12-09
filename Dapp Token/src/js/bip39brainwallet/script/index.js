// import local modules.
let jsbip39 = require("./jsbip39.js");
let sjcl = require("./sjcl-bip39.js");
let ent = require("./entropy.js");
let bigint = require("./biginteger.js");

function getbip39seeds(value) {
  let phrase;
  let entropyValue;

  // setting seed language
  let mnemonics = { english: new jsbip39.Mnemonic("english") };
  let mnemonic = mnemonics["english"];

  function longpassphraseChanged() {
    let hash = sjcl.sjcl.hash.sha256.hash(value);
    let hex = sjcl.sjcl.codec.hex.fromBits(hash);
    entropyValue = hex;
    setMnemonicFromEntropy();
  }

  function setMnemonicFromEntropy() {
    // Get entropy value
    let entropyStr = entropyValue;
    // Work out minimum base for entropy
    let entropy = ent.Entropy.fromString(entropyStr);
    if (entropy.binaryStr.length == 0) {
      return;
    }

    // Use entropy hash if not using raw entropy
    let bits = entropy.binaryStr;
    let mnemonicLength = 12;
    if (mnemonicLength != "raw") {
      // Get bits by hashing entropy with SHA256
      let hash = sjcl.sjcl.hash.sha256.hash(entropy.cleanStr);
      let hex = sjcl.sjcl.codec.hex.fromBits(hash);
      bits = bigint.BigInteger.parse(hex, 16).toString(2);
      while (bits.length % 256 != 0) {
        bits = "0" + bits;
      }
      // Truncate hash to suit number of words
      mnemonicLength = parseInt(mnemonicLength);
      let numberOfBits = (32 * mnemonicLength) / 3;
      bits = bits.substring(0, numberOfBits);
    }
    // Discard trailing entropy
    let bitsToUse = Math.floor(bits.length / 32) * 32;
    let start = bits.length - bitsToUse;
    let binaryStr = bits.substring(start);
    // Convert entropy string to numeric array
    let entropyArr = [];
    for (let i = 0; i < binaryStr.length / 8; i++) {
      let byteAsBits = binaryStr.substring(i * 8, i * 8 + 8);
      let entropyByte = parseInt(byteAsBits, 2);
      entropyArr.push(entropyByte);
    }
    // Convert entropy array to mnemonic
    phrase = mnemonic.toMnemonic(entropyArr);
    // console.log(phrase)
  }

  longpassphraseChanged();
  return phrase;
}

// exports
module.exports = {
  getbip39seeds: getbip39seeds
};
