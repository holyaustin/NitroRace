// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarNFT is ERC721, Ownable {
    uint256 public tokenCounter;

    struct Car {
        string name;
        uint256 speed;
    }

    mapping(uint256 => Car) public cars;

    // Custom Errors (gas efficient)
    error InvalidSpeed();
    error TransferNotPermitted();

    event CarMinted(uint256 indexed tokenId, address indexed owner, string name, uint256 speed);

    constructor() ERC721("NitroRace Car", "NRACE") Ownable(msg.sender) {}

    function mintCar(string memory name, uint256 speed) external {
        // Validate input
        if (speed == 0 || speed > 100) {
            revert InvalidSpeed();
        }

        uint256 newTokenId = tokenCounter; // Read once
        tokenCounter += 1; // Increment once

        _safeMint(msg.sender, newTokenId);

        // Store car data
        cars[newTokenId] = Car({
            name: name,
            speed: speed
        });

        emit CarMinted(newTokenId, msg.sender, name, speed);
    }

    function getCar(uint256 tokenId) external view returns (string memory, uint256) {
        if (!(_exists(tokenId))) {
            revert("Car does not exist");
        }
        return (cars[tokenId].name, cars[tokenId].speed);
    }

    // Override to disable transfers (optional: for demo-only NFTs)
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        if (to == address(0)) {
            // Allow burning
            return ERC721._update(to, tokenId, auth);
        }
        // Prevent all transfers
        revert TransferNotPermitted();
    }

    function _increaseBalance(address account, uint128 id)
        internal
        override(ERC721)
    {
        ERC721._increaseBalance(account, id);
    }
}