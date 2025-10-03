require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.20", // atau versi sesuai kontrakmu
  networks: {
    zenchainTestnet: {
      url: "https://zenchain-testnet.api.onfinality.io/public", // RPC endpoint
      accounts: [ "b36cf887618f715ae14556b44a66a628ea8f90f78424999a8b68cb3e6452a9cb" ],
      chainId: 8408,
      // Jangan share private key di publik, hanya untuk dev!
      // Bisa juga pakai env var: accounts: [process.env.PRIVATE_KEY]
    },
  }
};