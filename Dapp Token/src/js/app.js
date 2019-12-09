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
          console.log("event triggered", evt);
          App.render();
        });
    });
  },

  render: function() {
    if (App.loading) {
      return;
    }
    App.loading = true;

    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase((err, account) => {
      if (err === null) {
        console.log("account", account);
        App.account = account;
        $("#accountAddress").html("Your Account:" + account);
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
        $(".token-price").html(
          web3.fromWei(App.tokenPrice, "ether").toNumber()
        );
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
    $("#content").hide();
    $("#loader").show();

    var numberOfTokens = $("#numberOfTokens").val();

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
        $("#content").show();
        $("#loader").hide();
      });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
