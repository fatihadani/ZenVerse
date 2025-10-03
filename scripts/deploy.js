const hre = require("hardhat");

async function main() {
  // Ganti dengan nama dan simbol NFT yang kamu mau
  const name = "ZenchainNFT";
  const symbol = "ZTC";

  const ZenchainNFT = await hre.ethers.getContractFactory("ZenchainNFT");
  const contract = await ZenchainNFT.deploy("ZenchainNFT", "ZTC");

  await contract.deployed();

  console.log("ZenchainNFT deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});