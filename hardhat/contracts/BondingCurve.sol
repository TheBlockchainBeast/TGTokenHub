// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BondingCurve is Ownable, ReentrancyGuard {
    // Price = sqrt(supply) * PRICE_MULTIPLIER
    uint256 public constant PRICE_MULTIPLIER = 1e15; // 0.001 ETH per token at 1 supply
    uint256 public constant BONUS_THRESHOLD = 10; // First 10 buyers get bonus
    uint256 public constant BONUS_PERCENTAGE = 10; // 10% bonus for early buyers

    // Mapping from token address to its total supply
    mapping(address => uint256) public totalSupply;
    // Mapping from token address to number of unique buyers
    mapping(address => uint256) public uniqueBuyers;
    // Mapping from token address to mapping of buyer address to whether they got bonus
    mapping(address => mapping(address => bool)) public hasReceivedBonus;

    event TokensMinted(
        address indexed token,
        address indexed buyer,
        uint256 amount,
        uint256 price
    );
    event TokensBurned(
        address indexed token,
        address indexed seller,
        uint256 amount,
        uint256 price
    );

    constructor() {
        _transferOwnership(msg.sender);
    }

    /**
     * @dev Calculate the current price for a token based on its supply
     * @param token The token address
     * @return The current price in wei
     */
    function getCurrentPrice(address token) public view returns (uint256) {
        return sqrt(totalSupply[token]) * PRICE_MULTIPLIER;
    }

    /**
     * @dev Calculate how many tokens will be minted for a given ETH amount
     * @param token The token address
     * @param ethAmount The amount of ETH to spend
     * @return The amount of tokens that will be minted
     */
    function calculateTokensForEth(
        address token,
        uint256 ethAmount
    ) public view returns (uint256) {
        uint256 currentSupply = totalSupply[token];
        uint256 newSupply = sqrt(
            (currentSupply * currentSupply) +
                ((2 * ethAmount) / PRICE_MULTIPLIER)
        );
        return newSupply - currentSupply;
    }

    /**
     * @dev Mint tokens using the bonding curve
     * @param token The token to mint
     * @param amount The amount of tokens to mint
     */
    function mint(address token, uint256 amount) external payable nonReentrant {
        require(msg.value > 0, "Must send ETH");
        require(amount > 0, "Amount must be greater than 0");

        uint256 price = getCurrentPrice(token);
        uint256 cost = price * amount;
        require(msg.value >= cost, "Insufficient ETH sent");

        // Calculate bonus for early buyers
        uint256 bonus = 0;
        if (
            uniqueBuyers[token] < BONUS_THRESHOLD &&
            !hasReceivedBonus[token][msg.sender]
        ) {
            bonus = (amount * BONUS_PERCENTAGE) / 100;
            hasReceivedBonus[token][msg.sender] = true;
            uniqueBuyers[token]++;
        }

        // Update total supply
        totalSupply[token] += amount + bonus;

        // Transfer tokens to buyer
        IERC20(token).transfer(msg.sender, amount + bonus);

        // Refund excess ETH
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }

        emit TokensMinted(token, msg.sender, amount + bonus, price);
    }

    /**
     * @dev Burn tokens and receive ETH back
     * @param token The token to burn
     * @param amount The amount of tokens to burn
     */
    function burn(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(
            IERC20(token).balanceOf(msg.sender) >= amount,
            "Insufficient balance"
        );

        uint256 price = getCurrentPrice(token);
        uint256 ethAmount = price * amount;

        // Update total supply
        totalSupply[token] -= amount;

        // Transfer tokens from seller
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        // Transfer ETH to seller
        payable(msg.sender).transfer(ethAmount);

        emit TokensBurned(token, msg.sender, amount, price);
    }

    /**
     * @dev Square root function using Newton's method
     */
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
