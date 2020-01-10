// let contractAddress = "0x0aE4F2f7d9Ce32CBa4D2F5817e1B25B640eD7Edf";
// let contract = new ethers.Contract(contractAddress, Kiosk.abi, customProvider);
// // console.log(contract)
// contractWithSigner = contract.connect(wallet);
// return new Promise((resolve, reject) => {
//   contractWithSigner
//     .transfer(addressTo, deviceID, true)
//     .then(function(hash) {
//       resolve(hash);
//       console.log(`nonce: ${hash.nonce}`);
//       self.updateLockerLocation(deviceID, 0, hash.nonce);
//       customProvider.once(hash, receipt => {
//         // console.log('Transaction mined:')
//         // console.log(receipt)
//         // console.log('Transaction complete')
//       });
//       // callbackFunction();
//     })
//     .catch(function(err) {
//       reject(err);
//       console.log(err);
//     });
// });
