// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CarNFT is ERC721 {
    using Strings for uint256;

    uint256 public constant MAX_CARS = 5;
    uint256 public totalSupply;

    struct Car {
        string name;
        uint8 speed;
        uint8 handling;
        string color;
    }

    Car[5] public cars;

    error InvalidTokenId();
    error NotMinter();

    address public minter;

    constructor() ERC721("BlockchainRacer Car", "BCR") {
        minter = msg.sender;
        totalSupply = 0;

        cars[0] = Car("Nitro Blazer", 90, 60, "red");
        cars[1] = Car("Stealth Racer", 70, 90, "black");
        cars[2] = Car("Turbo Beast", 95, 50, "orange");
        cars[3] = Car("Drift King", 65, 95, "blue");
        cars[4] = Car("Quantum Flash", 85, 75, "purple");

        for (uint256 i = 0; i < MAX_CARS; i++) {
            _safeMint(minter, i);
        }
        totalSupply = MAX_CARS;
    }

    function mintTo(address to, uint256 carId) external {
        if (msg.sender != minter) revert NotMinter();
        if (carId >= MAX_CARS) revert InvalidTokenId();

        // ✅ Use `this.ownerOf` to make it external
        try this.ownerOf(carId) returns (address) {
            return; // Already minted
        } catch {
            // Not minted — proceed
        }

        _safeMint(to, carId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (tokenId >= MAX_CARS) revert InvalidTokenId();

        // ✅ Use `this.ownerOf` for external call
        try this.ownerOf(tokenId) returns (address) {
            // Exists
        } catch {
            revert InvalidTokenId();
        }

        Car memory car = cars[tokenId];

        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" style="background:#111">',
            '<rect width="100%" height="100%" fill="black"/>',
            '<rect x="30" y="90" width="140" height="40" fill="', car.color, '"/>',
            '<circle cx="50" cy="130" r="15" fill="gray"/>',
            '<circle cx="150" cy="130" r="15" fill="gray"/>',
            '<text x="100" y="50" font-size="14" text-anchor="middle" fill="white">',
            car.name,
            '</text>',
            '<text x="100" y="180" font-size="12" text-anchor="middle" fill="gray">',
            'Speed:', Strings.toString(uint256(car.speed)), ' | Handling:', Strings.toString(uint256(car.handling)),
            '</text>',
            '</svg>'
        );

        bytes memory json = abi.encodePacked(
            '{"name":"', car.name,
            '","description":"Blockchain Racer NFT',
            '","image":"data:image/svg+xml;base64,',
            _base64Encode(svg),
            '","attributes":[',
            '{"trait_type":"Speed","value":', Strings.toString(uint256(car.speed)), '},',
            '{"trait_type":"Handling","value":', Strings.toString(uint256(car.handling)), '}',
            ']}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                _base64Encode(json)
            )
        );
    }

    function _base64Encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 len = data.length;
        uint256 encodedLen = 4 * ((len + 2) / 3);
        string memory result = new string(encodedLen);

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            for { let i := 0 } lt(i, len) {} {
                i := add(i, 3)
                let octet1 := and(mload(add(data, add(32, i))), 0xFF)
                let octet2 := and(mload(add(data, add(32, add(i, 1)))), 0xFF)
                let octet3 := and(mload(add(data, add(32, add(i, 2)))), 0xFF)
                mstore8(resultPtr, mload(add(tablePtr, shr(2, octet1))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shl(4, and(octet1, 0x03)), shr(4, octet2)))))
                resultPtr := add(resultPtr, 1)
                switch lt(i, add(len, 2))
                case 1 {
                    mstore8(resultPtr, mload(add(tablePtr, and(shl(2, and(octet2, 0x0F)), shr(6, octet3)))))
                    resultPtr := add(resultPtr, 1)
                    switch lt(i, add(len, 1))
                    case 1 {
                        mstore8(resultPtr, mload(add(tablePtr, and(octet3, 0x3F))))
                        resultPtr := add(resultPtr, 1)
                    }
                    default {
                        mstore8(resultPtr, 61)
                        resultPtr := add(resultPtr, 1)
                    }
                }
                default {
                    mstore8(resultPtr, 61)
                    resultPtr := add(resultPtr, 1)
                    mstore8(resultPtr, 61)
                    resultPtr := add(resultPtr, 1)
                }
            }
        }
        return result;
    }
}