// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./TGToken.sol";
import "./BondingCurve.sol";

contract TGTokenFactory is Ownable {
    uint256 public constant MINT_FEE = 0.01 ether;
    BondingCurve public bondingCurve;
    mapping(string => address) public usernameToToken;
    mapping(address => string) public tokenToUsername;

    event TokenCreated(string indexed username, address indexed token);

    constructor(address _bondingCurve) {
        bondingCurve = BondingCurve(_bondingCurve);
        _transferOwnership(msg.sender);
    }

    /**
     * @dev Create a new token for a Telegram username
     * @param username The Telegram username
     */
    function createToken(string memory username) external payable {
        require(msg.value >= MINT_FEE, "Insufficient mint fee");
        require(
            usernameToToken[username] == address(0),
            "Username already taken"
        );

        // Create token name and symbol
        string memory name = string(abi.encodePacked("TG ", username));
        string memory symbol = string(abi.encodePacked("TG_", username));

        // Deploy new token
        TGToken token = new TGToken(
            name,
            symbol,
            msg.sender,
            address(bondingCurve)
        );
        address tokenAddress = address(token);

        // Update mappings
        usernameToToken[username] = tokenAddress;
        tokenToUsername[tokenAddress] = username;

        // Refund excess ETH
        if (msg.value > MINT_FEE) {
            payable(msg.sender).transfer(msg.value - MINT_FEE);
        }

        emit TokenCreated(username, tokenAddress);
    }

    /**
     * @dev Get the token address for a username
     */
    function getTokenAddress(
        string memory username
    ) external view returns (address) {
        return usernameToToken[username];
    }

    /**
     * @dev Get the username for a token address
     */
    function getTelegramUsername(
        address token
    ) external view returns (string memory) {
        return tokenToUsername[token];
    }
}
