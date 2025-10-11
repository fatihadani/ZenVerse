import React, { useState, useCallback, useRef } from "react";
import Navbar from "./components/Navbar";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import ZenchainAbi from "./abis/ZenchainAbi.json";
import "./App.css";

const NFT_CONTRACT_ADDRESS = "0xd22a82C45d451A8fe2482F0207c0643AA551C76c";

const nftList = [
  { name: "Zenchain Human", image: "/zenchainhuman-nft.png", tokenURI: "ipfs://bafkreifkmbepefc3j6qxmyx4jczfr3hwq4vbrbsyrxpy4o4hlrtumio24a" },
  { name: "Zenchain Horse", image: "/zenchainhorse-nft.png", tokenURI: "ipfs://bafkreicxc36o64ls4xx7q2cnymheeqqlaoc6tarmkoehfwtngogwdzlnzq" },
  { name: "Zenchain Rocket", image: "/zenchainrocket-nft.jpeg", tokenURI: "ipfs://bafkreie3p6cb2ae65scrboifbrtq35zuvrospyoonptdfs2lwzbnqy4r34" },
  { name: "Zenchain Cat", image: "/zenchaincat-nft.png", tokenURI: "ipfs://bafkreifst666hogv2vpd5efxvy3czfcsauwmg5pysm4xrndyha3ewy6oeq" },
  { name: "Zenchain Dog", image: "/zenchaindog-nft.png", tokenURI: "ipfs://bafkreicovxvwzz2pcaz6qfou5z3zvvb6csgbjver6oqitpltsljf7kzvny" },
  { name: "Zenchain", image: "/zenchain-logo.png", tokenURI: "ipfs://bafkreihwqigfzyq5a6xr6g4mlqzbhb2x5mpom424yiywbhqen5k6k6rrhi" },
];

function App() {
  const { address, isConnected, isConnecting } = useAccount();
  const [minted, setMinted] = useState({});
  const [loadingIdx, setLoadingIdx] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const { writeContract } = useWriteContract();
  const featuresRef = useRef(null);
  const chainsRef = useRef(null);
  const contactRef = useRef(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMint = useCallback(async (nft, idx) => {
    setErrorMsg("");
    if (!isConnected) {
      setErrorMsg('Please connect your wallet first!');
      return;
    }
    if (!address) {
      setErrorMsg('Wallet address not found!');
      return;
    }
    if (!nft.tokenURI) {
      setErrorMsg('Invalid tokenURI!');
      return;
    }
    setLoadingIdx(idx);
    try {
      alert("Please confirm the transaction in your wallet...");
      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: ZenchainAbi,
        functionName: 'mintNFT',
        args: [address, nft.tokenURI]
      }, {
        onSuccess: (txHash) => {
          setTxHash(txHash);
          setMinted((prev) => ({ ...prev, [idx]: true }));
          alert("Mint successful! TX hash: " + txHash);
          setLoadingIdx(null);
        },
        onError: (error) => {
          const errorMessage = error?.message || error?.shortMessage || error?.details || "Mint failed!";
          setErrorMsg(errorMessage);
          alert("Mint failed: " + errorMessage);
          setLoadingIdx(null);
        }
      });
    } catch (err) {
      const errorMessage = err?.message || err?.shortMessage || err?.details || "Mint failed!";
      setErrorMsg(errorMessage);
      alert("Mint failed: " + errorMessage);
    }
    setLoadingIdx(null);
  }, [isConnected, address, writeContract]);

  const handleBurn = useCallback(async (tokenId) => {
    setErrorMsg("");
    if (!isConnected) {
      setErrorMsg('Please connect your wallet first!');
      return;
    }
    if (!address) {
      setErrorMsg('Wallet address not found!');
      return;
    }
    setLoadingIdx(tokenId - 1);
    try {
      alert("Please confirm the transaction in your wallet...");
      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: ZenchainAbi,
        functionName: 'burn',
        args: [tokenId]
      }, {
        onSuccess: (txHash) => {
          setTxHash(txHash);
          setMinted((prev) => ({ ...prev, [tokenId - 1]: false }));
          alert("Burn successful! TX hash: " + txHash);
          setLoadingIdx(null);
        },
        onError: (error) => {
          const errorMessage = error?.message || error?.shortMessage || error?.details || "Burn failed!";
          setErrorMsg(errorMessage);
          alert("Burn failed: " + errorMessage);
          setLoadingIdx(null);
        }
      });
    } catch (err) {
      const errorMessage = err?.message || err?.shortMessage || err?.details || "Burn failed!";
      setErrorMsg(errorMessage);
      alert("Burn failed: " + errorMessage);
    }
    setLoadingIdx(null);
  }, [isConnected, address, writeContract]);

  const handleScrollToSection = (section) => {
    if (section === "features" && featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (section === "chains" && chainsRef.current) {
      chainsRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (section === "contact" && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isInitialized || isConnecting) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading ZenVerse...
      </div>
    );
  }

  return (
    <div id="root">
      {/* Navbar di kiri atas */}
      <Navbar onScrollToSection={handleScrollToSection} />

      {/* Wallet bar tetap di kanan atas */}
      <div className="wallet-bar">
        <div className="wallet-bar-content">
          <span className="network-label">Zenverse</span>
          <span className="ztc-label"></span>
          <ConnectButton />
        </div>
      </div>

      <div className="main-content">
        {/* ===== DISPLAY SECTION ===== */}
        <div className="hero-metaverse">
          <button className="studio-btn">MARKETPLACE</button>
          <h1 className="metaverse-title">ZENVERSE</h1>
          <p className="presentation-subtitle">MAKE YOUR OWN NFT COLLECTION</p>
          <div className="hero-corner-year"></div>
        </div>

        {/* NFT Collection */}
        <section className="nft-collections">
          <h2 className="collections-title">Collection NFT Zenverse</h2>
          <div className="collection-cards">
            {nftList.map((nft, idx) => (
              <div key={idx} className="collection-card">
                <img src={nft.image} alt={nft.name} className="collection-img" onError={(e) => { e.target.src = "/notfound.png" }} />
                <div className="collection-info">
                  <div className="collection-name">{nft.name}</div>
                  <div className="collection-meta">
                    <span className="collection-price">Free</span>
                    <span className="collection-items"></span>
                  </div>
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
        </section>

        {/* Features Section */}
        <section ref={featuresRef} id="features">
          <h2>Features</h2>
          <ul>
            <li>Mint NFT</li>
            <li>Wallet Connect</li>
            <li>Easy Integration</li>
            <li>collection ownership NFT</li>
          </ul>
        </section>

        {/* Chains Section */}
        <section ref={chainsRef} id="chains">
          <h2>Chains Supported</h2>
          <ul>
            <li>Zenchain Tesnet</li>
            <li>Faucet Zenchain Tesnet</li>
          </ul>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} id="contact">
          <h2>Contact Me</h2>
          <ul>
            <li>X / Twitter: <a href="https://twitter.com/yourtwitter">yourtwitter</a></li>
            <li>GitHub: <a href="https://github.com/fatihadani">fatihadani</a></li>
            <li>Email: your@email.com</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;
