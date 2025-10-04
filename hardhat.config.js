require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.20", // atau versi sesuai kontrakmu
  networks: {
    zenchainTestnet: {
      url: "https://zenchain-testnet.api.onfinality.io/public", // RPC endpoint
      accounts: [ "" ],
      chainId: 8408,
      // Jangan share private key di publik, hanya untuk dev!
      // Bisa juga pakai env var: accounts: [process.env.PRIVATE_KEY]
    },
  }
};
