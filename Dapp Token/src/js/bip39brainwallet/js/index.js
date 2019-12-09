function getbip39seeds() {
    console.log('input: ' + document.getElementById('longpassphrase').value)
    
    let rfid = 'asd'
    let entropyValue

    // setting seed language
    let mnemonics = { "english": new Mnemonic("english") };
    let mnemonic = mnemonics["english"];

    function longpassphraseChanged() {
        // generates from input phrase
        // let hash = sjcl.hash.sha256.hash(DOM.longpassphrase.val());
        // Generates form input non DOM
        let value = document.getElementById('longpassphrase').value
        let hash = sjcl.hash.sha256.hash(value);
        // generates from rfid Input
        // let hash = sjcl.hash.sha256.hash(rfid);
    	let hex = sjcl.codec.hex.fromBits(hash);
        entropyValue = hex
    	setMnemonicFromEntropy();
    }

    function setMnemonicFromEntropy() {
        // Get entropy value
        let entropyStr = entropyValue
        // Work out minimum base for entropy
        let entropy = Entropy.fromString(entropyStr);
        if (entropy.binaryStr.length == 0) {
            return;
        }
 
        // Use entropy hash if not using raw entropy
        let bits = entropy.binaryStr;
        let mnemonicLength = 12;
        if (mnemonicLength != "raw") {
            // Get bits by hashing entropy with SHA256
            let hash = sjcl.hash.sha256.hash(entropy.cleanStr);
            let hex = sjcl.codec.hex.fromBits(hash);
            bits = BigInteger.parse(hex, 16).toString(2);
            while (bits.length % 256 != 0) {
                bits = "0" + bits;
            }
            // Truncate hash to suit number of words
            mnemonicLength = parseInt(mnemonicLength);
            let numberOfBits = 32 * mnemonicLength / 3;
            bits = bits.substring(0, numberOfBits);
        }
        // Discard trailing entropy
        let bitsToUse = Math.floor(bits.length / 32) * 32;
        let start = bits.length - bitsToUse;
        let binaryStr = bits.substring(start);
        // Convert entropy string to numeric array
        let entropyArr = [];
        for (let i=0; i<binaryStr.length / 8; i++) {
            let byteAsBits = binaryStr.substring(i*8, i*8+8);
            let entropyByte = parseInt(byteAsBits, 2);
            entropyArr.push(entropyByte)
        }
        // Convert entropy array to mnemonic
        let phrase = mnemonic.toMnemonic(entropyArr);
        console.log(phrase)

        let seeddisplay = document.getElementById('seedphrasedisplay')
        seeddisplay.innerHTML = phrase
    }

    longpassphraseChanged()
} 
