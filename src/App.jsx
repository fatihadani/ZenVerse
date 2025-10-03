import React, { useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import ZenchainAbi from "./abis/ZenchainAbi.json";
import "./App.css";

const NFT_CONTRACT_ADDRESS = "0xEBcdbeCdaF19992dFfbc1AB1129DB999f3c73cf9";

function App() {
  const { address, isConnected } = useAccount();
  const [minted, setMinted] = useState({});
  const [loadingIdx, setLoadingIdx] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Wagmi mint pakai ZenchainAbi
  const { writeContractAsync: mintNFT } = useWriteContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: ZenchainAbi,
    functionName: 'mintNFT',
  });

  // Wagmi burn pakai ZenchainAbi
  const { writeContractAsync: burnNFT } = useWriteContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: ZenchainAbi,
    functionName: 'burn',
  });

  // Pastikan file gambar di folder /public dan nama sesuai
  const nftList = [
    { name: "Zenchain Human", image: "/zenchainhuman-nft.png", TokenBaseURI: "ipfs://your_base_uri_1" },
    { name: "Zenchain Horse", image: "/zenhorse-nft.jpeg", TokenBaseURI: "ipfs://your_base_uri_2" },
    { name: "Zenchain Rocket", image: "/zenrocket-nft.jpeg", TokenBaseURI: "ipfs://your_base_uri_3" },
    { name: "Zenchain Cat", image: "/zencat-nft.png", TokenBaseURI: "ipfs://your_base_uri_4" },
    { name: "Zenchain Dog", image: "/zendog-nft.png", TokenBaseURI: "ipfs://your_base_uri_5" },
    { name: "Zenchain Spaceship", image: "/zenspaceship-nft.png", TokenBaseURI: "ipfs://your_base_uri_6" },
  ];

  const handleMint = async (nft, idx) => {
    setErrorMsg("");
    if (!isConnected) return setErrorMsg('Connect wallet dulu!');
    setLoadingIdx(idx);
    try {
      const tx = await mintNFT({ args: [address, nft.TokenBaseURI] });
      setMinted((prev) => ({ ...prev, [idx]: true }));
      setTxHash(tx?.hash ? tx.hash : "");
      alert("Mint berhasil, TX hash: " + (tx?.hash || JSON.stringify(tx)));
    } catch (err) {
      setErrorMsg(err.message || "Mint gagal!");
      alert("Mint gagal: " + (err.message || JSON.stringify(err)));
    }
    setLoadingIdx(null);
  };

  const handleBurn = async (tokenId) => {
    setErrorMsg("");
    if (!isConnected) return setErrorMsg('Connect wallet dulu!');
    setLoadingIdx(tokenId - 1);
    try {
      const tx = await burnNFT({ args: [tokenId] });
      setTxHash(tx?.hash ? tx.hash : "");
      setMinted((prev) => ({ ...prev, [tokenId - 1]: false }));
      alert("Burn berhasil, TX hash: " + (tx?.hash || JSON.stringify(tx)));
    } catch (err) {
      setErrorMsg(err.message || "Burn gagal!");
      alert("Burn gagal: " + (err.message || JSON.stringify(err)));
    }
    setLoadingIdx(null);
  };

  return (
    <>
      {/* Wallet bar di luar landing, pojok kanan atas */}
      <div className="wallet-bar">
        <div className="wallet-bar-content">
          <span className="network-label">ZenVerse</span>
          <span className="ztc-label"></span>
          <ConnectButton />
        </div>
      </div>
      <div className="landing">
        <header className="hero-section">
          {/* Logo juga pastikan di /public */}
          <img src="/zenchain-logo.png" alt="zenchain logo" className="logo" />
          <h1>Make Your Own NFT Collection</h1>
          <p></p>
        </header>
        <section className="showcase">
          <div className="collection-preview">
            <h2>Collection NFT Zenverse</h2>
            <div className="nft-cards">
              {nftList.map((nft, idx) => (
                <div key={idx} className="nft-card">
                  {/* Gambar NFT: pastikan path benar dan file ada di /public */}
                  <img src={nft.image} alt={nft.name} className="nft-img" onError={(e) => {e.target.src = "/notfound.png"}} />
                  {/* opsional: tambahkan gambar notfound.png di public jika ingin error fallback */}
                  <div className="nft-info">
                    <div className="nft-name">{nft.name}</div>
                    {!minted[idx] ? (
                      <button
                        className="mint-btn"
                        disabled={loadingIdx === idx}
                        onClick={() => handleMint(nft, idx)}
                      >
                        {loadingIdx === idx ? "Loading..." : "Mint"}
                      </button>
                    ) : (
                      <button
                        className="burn-btn"
                        disabled={loadingIdx === idx}
                        onClick={() => handleBurn(idx + 1)}
                      >
                        {loadingIdx === idx ? "Loading..." : "Burn"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {txHash && (
            <div className="tx-info">
              <strong>TX Hash:</strong>{" "}
              <a
                href={`https://zentrace.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {txHash}
              </a>
            </div>
          )}
          {errorMsg && (
            <div className="error-msg">
              <strong>Error:</strong> {errorMsg}
            </div>
          )}
          <div className="info-msg"></div>
        </section>
      </div>
    </>
  );
}

export default App;