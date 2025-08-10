// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarNFT is ERC721, Ownable {
    uint256 public totalSupply;
    uint256 public maxSupply = 1000;

    mapping(uint256 => string) private _tokenURIs;

    error ExceedsMaxSupply();
    error URIQueryForNonexistentToken();

    constructor() ERC721("BlockchainRacer Car", "BCR") Ownable(msg.sender) {}

    function mint(address to, uint256 tokenId, string memory uri) external onlyOwner {
        if (totalSupply >= maxSupply) revert ExceedsMaxSupply();

        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = uri;
        totalSupply++;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // Check if token exists using ownerOf (reverts if not)
        try this.ownerOf(tokenId) returns (address) {
            // exists
        } catch {
            revert URIQueryForNonexistentToken();
        }
        return _tokenURIs[tokenId];
    }

    function setTokenURI(uint256 tokenId, string memory uri) external onlyOwner {
        // Check existence
        try this.ownerOf(tokenId) returns (address) {
            // exists
        } catch {
            revert URIQueryForNonexistentToken();
        }
        _tokenURIs[tokenId] = uri;
    }
}