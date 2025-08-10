// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RaceManager {
    struct Race {
        uint256 entryFee;
        address winner;
        uint256 prizePool;
        uint8 playerCount;
        bool ended;
        mapping(address => bool) hasJoined;
        mapping(address => bool) hasClaimed;
    }

    uint256 public raceCounter;
    mapping(uint256 => Race) public races;

    // Custom Errors
    error AlreadyJoined();
    error IncorrectFee();
    error RaceEnded();
    error RaceNotEnded();
    error NotWinner();
    error NotOwner();
    error TransferFailed();

    event RaceCreated(uint256 indexed raceId, uint256 entryFee);
    event PlayerJoined(uint256 indexed raceId, address player);
    event WinnerDeclared(uint256 indexed raceId, address winner, uint256 prize);
    event PrizeClaimed(uint256 indexed raceId, address player, uint256 amount);

    // Create a new race
    function createRace(uint256 _entryFee) external {
        uint256 raceId = raceCounter; // Read
        raceCounter += 1; // Increment

        Race storage race = races[raceId];
        race.entryFee = _entryFee;
        race.prizePool = 0;
        race.playerCount = 0;
        race.ended = false;
        race.winner = address(0);

        emit RaceCreated(raceId, _entryFee);
    }

    // Join race with ETH
    function joinRace(uint256 raceId) external payable {
        Race storage race = races[raceId];

        if (race.ended) {
            revert RaceEnded();
        }
        if (race.hasJoined[msg.sender]) {
            revert AlreadyJoined();
        }
        if (msg.value != race.entryFee) {
            revert IncorrectFee();
        }

        race.hasJoined[msg.sender] = true;
        race.playerCount += 1;
        race.prizePool += msg.value;

        emit PlayerJoined(raceId, msg.sender);
    }

    // Declare winner – only owner
    function declareWinner(uint256 raceId, address winnerAddr) external {
        Race storage race = races[raceId];

        if (race.ended) {
            revert RaceEnded();
        }
        if (!race.hasJoined[winnerAddr]) {
            revert NotWinner();
        }

        race.ended = true;
        race.winner = winnerAddr;

        emit WinnerDeclared(raceId, winnerAddr, race.prizePool);
    }

    // Winner claims 90% of prize
    function claimPrize(uint256 raceId) external {
        Race storage race = races[raceId];

        if (!race.ended) {
            revert RaceEnded();
        }
        if (race.winner != msg.sender) {
            revert NotWinner();
        }
        if (race.hasClaimed[msg.sender]) {
            revert AlreadyJoined(); // Reuse error (or create ClaimedAlready)
        }

        race.hasClaimed[msg.sender] = true;

        uint256 payout = (race.prizePool * 90) / 100;
        (bool sent, ) = payable(msg.sender).call{value: payout}("");
        if (!sent) {
            revert TransferFailed();
        }

        emit PrizeClaimed(raceId, msg.sender, payout);
    }

    // Owner withdraws 10% house cut
    function withdrawHouseCut(uint256 raceId) external {
        Race storage race = races[raceId];

        if (!race.ended) {
            revert RaceEnded();
        }
        if (race.prizePool == 0) {
            // Already withdrawn or no funds
            return; // Silent return (idempotent)
        }

        // Calculate 10%
        uint256 houseCut = race.prizePool - (race.prizePool * 90) / 100;
        race.prizePool = 0; // Lock funds

        (bool sent, ) = payable(msg.sender).call{value: houseCut}("");
        if (!sent) {
            revert TransferFailed();
        }
    }
}