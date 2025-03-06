// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./BondingCurve.sol";

contract TGToken is ERC20, Ownable {
    address public creator;
    string public telegramUsername;
    uint256 public socialScore;
    uint256 public lastUpdate;
    BondingCurve public bondingCurve;

    event SocialScoreUpdated(uint256 newScore);

    constructor(
        string memory name,
        string memory symbol,
        address _creator,
        address _bondingCurve
    ) ERC20(name, symbol) {
        creator = _creator;
        telegramUsername = name;
        bondingCurve = BondingCurve(_bondingCurve);
        lastUpdate = block.timestamp;
        _transferOwnership(_creator);
    }

    /**
     * @dev Update the social score for this token
     * @param newScore The new social score
     */
    function updateSocialScore(uint256 newScore) external onlyOwner {
        socialScore = newScore;
        lastUpdate = block.timestamp;
        emit SocialScoreUpdated(newScore);
    }

    /**
     * @dev Mint tokens using the bonding curve
     * @param amount The amount of tokens to mint
     */
    function mint(uint256 amount) external payable {
        bondingCurve.mint{value: msg.value}(address(this), amount);
    }

    /**
     * @dev Burn tokens and receive ETH back
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) external {
        bondingCurve.burn(address(this), amount);
    }

    /**
     * @dev Get the current price of the token
     */
    function getCurrentPrice() external view returns (uint256) {
        return bondingCurve.getCurrentPrice(address(this));
    }

    /**
     * @dev Calculate how many tokens will be minted for a given ETH amount
     */
    function calculateTokensForEth(
        uint256 ethAmount
    ) external view returns (uint256) {
        return bondingCurve.calculateTokensForEth(address(this), ethAmount);
    }
}
