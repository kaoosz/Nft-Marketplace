const Migrations = artifacts.require("Migrations");
const NFTMarket = artifacts.require("NFTMarket");
const Token = artifacts.require("Token");

module.exports = (deployer, network) => {

  deployer.deploy(NFTMarket).then(function() {
    return deployer.deploy(Token, NFTMarket.address)
  });
};
// Deploying 'NFTMarket'
// > contract address:     0xB57720B03D7ad1567D58b4436DFC49d0F2b0dD6A

// Deploying 'Token'
//> contract address:    0xd3F27910C6cB7f2EE4D19e1259758c4D902Faeb1