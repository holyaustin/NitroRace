// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RaceManager {
    struct Race {
        uint256 raceId;
        address[] players;
        uint256 entryFee;
        bool started;
        bool ended;
        address winner;
        mapping(address => bool) hasJoined;
        mapping(address => bool) hasClaimed;
    }

    struct CarNFT {
        uint256 tokenId;
        string carName;
        uint256 speed; // 1-100
    }

    uint256 public raceCounter = 0;
    mapping(uint256 => Race) public races;
    mapping(address => CarNFT[]) public playerCars;

    event RaceCreated(uint256 raceId, uint256 entryFee);
    event PlayerJoined(uint256 raceId, address player);
    event WinnerDeclared(uint256 raceId, address winner, uint256 prize);
    event PrizeClaimed(uint256 raceId, address player, uint256 amount);

    // Create a new race
    function createRace(uint256 _entryFee) external {
        uint256 newRaceId = raceCounter++;
        Race storage race = races[newRaceId];
        race.raceId = newRaceId;
        race.entryFee = _entryFee;
        race.started = false;
        race.ended = false;

        emit RaceCreated(newRaceId, _entryFee);
    }

    // Join race with entry fee
    function joinRace(uint256 raceId) external payable {
        Race storage race = races[raceId];
        require(!race.hasJoined[msg.sender], "Already joined");
        require(msg.value == race.entryFee, "Incorrect entry fee");
        require(!race.started, "Race already started");

        race.players.push(msg.sender);
        race.hasJoined[msg.sender] = true;

        emit PlayerJoined(raceId, msg.sender);
    }

    // Declare winner (only owner or trusted oracle — for demo, owner does it)
    function declareWinner(uint256 raceId, address winnerAddr) external {
        Race storage race = races[raceId];
        require(!race.ended, "Race already ended");
        require(!race.started, "Race not started yet");
        require(race.hasJoined[winnerAddr], "Winner not in race");

        race.ended = true;
        race.winner = winnerAddr;

        uint256 prize = race.entryFee * race.players.length;
        emit WinnerDeclared(raceId, winnerAddr, prize);
    }

    // Winner claims prize
    function claimPrize(uint256 raceId) external {
        Race storage race = races[raceId];
        require(race.ended, "Race not ended");
        require(race.winner == msg.sender, "Not winner");
        require(!race.hasClaimed[msg.sender], "Already claimed");

        race.hasClaimed[msg.sender] = true;
        payable(msg.sender).transfer(race.entryFee * race.players.length);

        emit PrizeClaimed(raceId, msg.sender, race.entryFee * race.players.length);
    }

    // Mint mock car NFT (demo only)
    function mintCar(string memory name, uint256 speed) external {
        playerCars[msg.sender].push(CarNFT({
            tokenId: playerCars[msg.sender].length,
            carName: name,
            speed: speed
        }));
    }

    function getCars(address player) external view returns (CarNFT[] memory) {
        return playerCars[player];
    }
}