// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ZenchainNFT is ERC721URIStorage {
    uint256 public tokenCounter;

    event NFTMinted(address indexed to, uint256 tokenId, string TokenBaseURI);
    event NFTBurned(uint256 tokenId);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        tokenCounter = 1;
    }

    function mintNFT(address to, string memory TokenBaseURI) public returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, TokenBaseURI);
        tokenCounter++;
        emit NFTMinted(to, newTokenId, TokenBaseURI); // Emit event
        return newTokenId;
    }

    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can burn");
        _burn(tokenId);
        emit NFTBurned(tokenId); // Emit event
    }
}