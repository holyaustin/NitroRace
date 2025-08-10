// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract RaceManager {
    struct Race {
        uint256 entryFee;
        address[] players;
        bool started;
        bool ended;
        address winner;
        mapping(address => bool) hasJoined;
        mapping(address => bool) hasClaimed;
    }

    IERC721 public immutable carNFT;
    uint256 public raceCounter;
    mapping(uint256 => Race) public races;

    error InvalidRaceId();
    error RaceNotEnded();
    error NotWinner();
    error AlreadyClaimed();
    error NotOwner();
    error InsufficientValue();
    error AlreadyJoined();

    address public owner;

    event RaceCreated(uint256 raceId, uint256 entryFee);
    event PlayerJoined(uint256 raceId, address player);
    event WinnerDeclared(uint256 raceId, address winner, uint256 prize);
    event PrizeClaimed(uint256 raceId, address player, uint256 amount);

    constructor(address _carNFT) {
        carNFT = IERC721(_carNFT);
        owner = msg.sender;
    }

    function createRace(uint256 _entryFee) external {
        uint256 raceId = raceCounter++;
        Race storage race = races[raceId];
        race.entryFee = _entryFee;
        race.started = false;
        race.ended = false;

        emit RaceCreated(raceId, _entryFee);
    }

    function joinRace(uint256 raceId) external payable {
        Race storage race = races[raceId];
        if (raceId >= raceCounter) revert InvalidRaceId();
        if (race.hasJoined[msg.sender]) revert AlreadyJoined();
        if (msg.value != race.entryFee) revert InsufficientValue();

        race.players.push(msg.sender);
        race.hasJoined[msg.sender] = true;

        emit PlayerJoined(raceId, msg.sender);
    }

    function declareWinner(uint256 raceId, address winnerAddr) external {
        if (msg.sender != owner) revert NotOwner();
        Race storage race = races[raceId];
        if (raceId >= raceCounter || race.ended) return;
        if (!race.hasJoined[winnerAddr]) revert InvalidRaceId();

        race.ended = true;
        race.winner = winnerAddr;

        emit WinnerDeclared(raceId, winnerAddr, race.entryFee * race.players.length);
    }

    function claimPrize(uint256 raceId) external {
        Race storage race = races[raceId];
        if (!race.ended) revert RaceNotEnded();
        if (race.winner != msg.sender) revert NotWinner();
        if (race.hasClaimed[msg.sender]) revert AlreadyClaimed();

        race.hasClaimed[msg.sender] = true;
        (bool sent, ) = payable(msg.sender).call{value: race.entryFee * race.players.length}("");
        require(sent, "Transfer failed");

        emit PrizeClaimed(raceId, msg.sender, race.entryFee * race.players.length);
    }
}