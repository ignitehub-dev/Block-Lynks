App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 0,
  tokensAvailable: 750000,

  init: function() {
    console.log("App initialized...");
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== "undefined") {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("TokenSale.json", function(tokenSale) {
      App.contracts.TokenSale = TruffleContract(tokenSale);
      App.contracts.TokenSale.setProvider(App.web3Provider);
      App.contracts.TokenSale.deployed().then(function(tokenSale) {
        console.log("Token Sale Address:", tokenSale.address);
      });
    }).done(function() {
      $.getJSON("Token.json", function(token) {
        App.contracts.Token = TruffleContract(token);
        App.contracts.Token.setProvider(App.web3Provider);
        App.contracts.Token.deployed().then(function(token) {
          console.log("Token Address:", token.address);
        });
        App.listenforevents();
        return App.render();
      });
    });
  },

  listenforevents: () => {
    App.contracts.TokenSale.deployed().then(instnace => {
      instnace
        .Sell(
          {},
          {
            fromBlock: 0,
            toBlock: "latest"
          }
        )
        .watch((err, evt) => {
          // console.log("event triggered", evt);
          App.render();
        });
    });
  },

  render: async function() {
    if (App.loading) {
      return;
    }
    App.loading = true;

    // console.log("test", web3.eth.getBlock(1));

    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase((err, account) => {
      if (err === null) {
        App.account = account;
      }
    });

    App.contracts.TokenSale.deployed()
      .then(instance => {
        tokenSaleInstance = instance;
        return tokenSaleInstance.tokenPrice();
      })
      .then(tokenPrice => {
        App.tokenPrice = tokenPrice;
        console.log("token price", App.tokenPrice.toNumber());
        return tokenSaleInstance.tokensSold();
      })
      .then(tokensSold => {
        App.tokensSold = tokensSold.toNumber();
        $(".tokens-sold").html(App.tokensSold);
        $(".tokens-available").html(App.tokensAvailable);

        var progressPercent = (App.tokensSold / App.tokensAvailable) * 100;
        $("#progress").css("width", progressPercent + "%");

        App.contracts.Token.deployed()
          .then(instance => {
            tokenInstance = instance;
            return tokenInstance.balanceOf(App.account);
          })
          .then(balance => {
            $(".token-balance").html(balance.toNumber());
          });
      });

    App.loading = false;
    loader.hide();
    content.show();
  },

  buyTokens: () => {
    let empId = $("#uid").val();
    console.log(empId);
    let newPhrase = getbip39seeds(empId);
    console.log(newPhrase);
    let secretPhrase = $("#secretPhrase");
    secretPhrase.val(newPhrase);
    let mnemonicWallet = ethers.Wallet.fromMnemonic(newPhrase);
    console.log(mnemonicWallet);
    // let path = "http://127.0.0.1:8545";
    // let customProvider = new ethers.providers.JsonRpcProvider(path);
    let pKey = mnemonicWallet.signingKey.keyPair.privateKey;
    let privateKey = $("#privateKey");
    privateKey.val(pKey);
    let address = mnemonicWallet.signingKey.address;
    let wallet = $("#wallet");
    wallet.val(address);

    // $("#content").hide();
    // $("#loader").show();

    // Begin Block Render

    web3.eth.getBlock("latest", function(e, res) {
      $("#accordion").html("");
      var latest = res["number"];

      for (var i = 0; i < 10; i++) {
        var block = latest - i;
        web3.eth.getBlock(block, function(error, result) {
          // console.log(result["transactions"][0]);

          web3.eth.getTransaction(result["transactions"][0], (err, res) => {
            // from: "0x0ae4f2f7d9ce32cba4d2f5817e1b25b640ed7edf"
            // to: "0x37bbce7940782b86371f779eebc5a9d59bafea25"
            // value: e {s: 1, e: 0, c: Array(1)}
            // gas: 500000
            // gasPrice: e {s: 1, e: 0, c: Array(1)}

            var html =
              "<div class='card'> \
    <div class='card-header' id='heading" +
              result["number"] +
              "'> \
      <h5 class='mb-0'> \
        <button class='btn btn-link' data-toggle='collapse' data-target='#collapse" +
              result["number"] +
              "' aria-expanded='false' aria-controls='collapse" +
              result["number"] +
              "'> \
          Block #" +
              result["number"] +
              "\
        </button> \
      </h5> \
    </div> \
    <div id='collapse" +
              result["number"] +
              "' class='collapse' aria-labelledby='heading" +
              result["number"] +
              "' data-parent='#accordion'> \
      <div class='card-body'> \
              <p style='border: lightgrey solid 1px; padding: 5px;     border-radius: 10px; \
              '><u>Transaction</u>: <br> \
                To: " +
              res["to"] +
              "<br> \
                From: " +
              address +
              "<br> \
                Value:  1<br> \
                Price: 0<br> \
              </p>\
            <p><u>Hash</u>: <br>" +
              result["hash"] +
              "</p> \
            <p><u>Parent Hash</u>: <br>" +
              result["parentHash"] +
              " </p>\
            <p><u>Nonce</u>: <br>" +
              result["nonce"] +
              " </p>\
            <p><u>Sha3Uncles</u>: <br>" +
              result["sha3Uncles"] +
              " </p>\
            <p><u>Transactions Root</u>: <br>" +
              result["transactionsRoot"] +
              " </p>\
            <p><u>State Root</u>: <br>" +
              result["stateRoot"] +
              " </p>\
            <p><u>Receipts Root</u>: <br>" +
              result["receiptsRoot"] +
              " </p>\
            <p><u>Size</u>: <br>" +
              result["size"] +
              " Bytes </p>\
            <p><u>Gas Limit</u>: <br>" +
              result["gasLimit"] +
              " </p>\
            <p><u>Gas Used</u>: <br>" +
              result["gasUsed"] +
              " </p>\
            <p><u>Timestamp</u>: <br>" +
              result["timestamp"] +
              " </p>\
      </div> \
    </div> \
    </div>";

            $("#accordion").append(html);
          });
        });
      }
    });
    // End Block Render

    var numberOfTokens = $("#numberOfTokens").val();
    console.log(App.account);
    App.contracts.TokenSale.deployed()
      .then(instance => {
        return instance.buyTokens(numberOfTokens, {
          from: App.account,
          value: numberOfTokens * App.tokenPrice,
          gas: 500000
        });
      })
      .then(result => {
        console.log("Tokens bought...");
        $("form").trigger("reset");
        // $("#content").show();
        // $("#loader").hide();
      });
  },

  generate: () => {
    let empId = $("#uid").val();
    console.log(empId);
    let newPhrase = getbip39seeds(empId);
    console.log(newPhrase);
    let secretPhrase = $("#secretPhrase");
    secretPhrase.val(newPhrase);
    let mnemonicWallet = ethers.Wallet.fromMnemonic(newPhrase);
    console.log(mnemonicWallet);
    // let path = "http://127.0.0.1:8545";
    // let customProvider = new ethers.providers.JsonRpcProvider(path);
    let pKey = mnemonicWallet.signingKey.keyPair.privateKey;
    let privateKey = $("#privateKey");
    privateKey.val(pKey);
    let address = mnemonicWallet.signingKey.address;
    let wallet = $("#wallet");
    wallet.val(address);
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
