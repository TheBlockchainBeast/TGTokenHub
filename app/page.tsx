"use client";

import { useState, useEffect } from "react";
import { ContractService } from "./services/contracts";
import { useWeb3 } from "./components/Web3Provider";
import { ethers } from "ethers";

const contractService = new ContractService();

export default function Home() {
  const { account, signer, connect, disconnect } = useWeb3();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const [mintAmount, setMintAmount] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [currentPrice, setCurrentPrice] = useState<bigint | null>(null);
  const [tokensToMint, setTokensToMint] = useState<bigint | null>(null);

  useEffect(() => {
    if (signer) {
      contractService.connect(signer);
    }
  }, [signer]);

  useEffect(() => {
    if (tokenAddress) {
      loadTokenInfo();
    }
  }, [tokenAddress]);

  const loadTokenInfo = async () => {
    if (!tokenAddress) return;
    try {
      const info = await contractService.getTokenInfo(tokenAddress);
      setTokenInfo(info);
      const price = await contractService.getCurrentPrice(tokenAddress);
      setCurrentPrice(price);
    } catch (error) {
      console.error("Failed to load token info:", error);
      setError("Failed to load token info");
    }
  };

  const createToken = async () => {
    if (!account || !username) return;

    setLoading(true);
    setError(null);
    try {
      const tx = await contractService.createToken(username);
      console.log("Token created:", tx);

      // Get token address after creation
      const address = await contractService.getTokenAddress(username);
      setTokenAddress(address);
      await loadTokenInfo();
    } catch (error) {
      console.error("Failed to create token:", error);
      setError("Failed to create token");
    } finally {
      setLoading(false);
    }
  };

  const checkToken = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);
    try {
      const address = await contractService.getTokenAddress(username);
      if (address !== ethers.ZeroAddress) {
        setTokenAddress(address);
        await loadTokenInfo();
      } else {
        setTokenInfo(null);
        setTokenAddress(null);
      }
    } catch (error) {
      console.error("Failed to check token:", error);
      setError("Failed to check token");
    } finally {
      setLoading(false);
    }
  };

  const calculateTokens = async () => {
    if (!tokenAddress || !ethAmount) return;
    try {
      const amount = ethers.parseEther(ethAmount);
      const tokens = await contractService.calculateTokensForEth(
        tokenAddress,
        amount
      );
      setTokensToMint(tokens);
    } catch (error) {
      console.error("Failed to calculate tokens:", error);
      setError("Failed to calculate tokens");
    }
  };

  const mintTokens = async () => {
    if (!tokenAddress || !mintAmount || !ethAmount) return;
    try {
      setLoading(true);
      const amount = BigInt(mintAmount);
      const ethValue = ethers.parseEther(ethAmount);
      const tx = await contractService.mintTokens(
        tokenAddress,
        amount,
        ethValue
      );
      console.log("Tokens minted:", tx);
      await loadTokenInfo();
    } catch (error) {
      console.error("Failed to mint tokens:", error);
      setError("Failed to mint tokens");
    } finally {
      setLoading(false);
    }
  };

  const burnTokens = async () => {
    if (!tokenAddress || !mintAmount) return;
    try {
      setLoading(true);
      const amount = BigInt(mintAmount);
      const tx = await contractService.burnTokens(tokenAddress, amount);
      console.log("Tokens burned:", tx);
      await loadTokenInfo();
    } catch (error) {
      console.error("Failed to burn tokens:", error);
      setError("Failed to burn tokens");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-8">TGTokenHub</h1>
          <p className="text-xl text-center text-gray-300 mb-12">
            Turn your Telegram username into a tradable token
          </p>

          <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
            {!account ? (
              <div className="text-center">
                <button
                  onClick={connect}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Connected:</span>
                  <span className="font-mono">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Telegram Username
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="@your_username"
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={checkToken}
                      disabled={loading || !username}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Check
                    </button>
                  </div>
                </div>

                {!tokenInfo && (
                  <button
                    onClick={createToken}
                    disabled={loading || !username}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Create Token"}
                  </button>
                )}

                {tokenInfo && (
                  <div className="space-y-6">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-bold mb-2">Token Info</h3>
                      <div className="space-y-2">
                        <p>
                          <span className="text-gray-400">Name:</span>{" "}
                          {tokenInfo.name}
                        </p>
                        <p>
                          <span className="text-gray-400">Symbol:</span>{" "}
                          {tokenInfo.symbol}
                        </p>
                        <p>
                          <span className="text-gray-400">Creator:</span>{" "}
                          {tokenInfo.creator}
                        </p>
                        <p>
                          <span className="text-gray-400">Social Score:</span>{" "}
                          {tokenInfo.socialScore.toString()}
                        </p>
                        <p>
                          <span className="text-gray-400">Last Update:</span>{" "}
                          {new Date(
                            Number(tokenInfo.lastUpdate) * 1000
                          ).toLocaleString()}
                        </p>
                        {currentPrice && (
                          <p>
                            <span className="text-gray-400">
                              Current Price:
                            </span>{" "}
                            {ethers.formatEther(currentPrice)} ETH
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Amount to Mint/Burn
                        </label>
                        <input
                          type="number"
                          value={mintAmount}
                          onChange={(e) => setMintAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          ETH Amount (for minting)
                        </label>
                        <input
                          type="number"
                          value={ethAmount}
                          onChange={(e) => setEthAmount(e.target.value)}
                          placeholder="Enter ETH amount"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {tokensToMint && (
                        <p className="text-sm text-gray-400">
                          You will receive approximately{" "}
                          {tokensToMint.toString()} tokens
                        </p>
                      )}

                      <div className="flex gap-4">
                        <button
                          onClick={calculateTokens}
                          disabled={loading || !ethAmount}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Calculate
                        </button>
                        <button
                          onClick={mintTokens}
                          disabled={loading || !mintAmount || !ethAmount}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Mint
                        </button>
                        <button
                          onClick={burnTokens}
                          disabled={loading || !mintAmount}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Burn
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-900 text-white p-4 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  onClick={disconnect}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Fair Launch</h3>
              <p className="text-gray-400">
                No pre-mine, bonding curve minting, and anti-snipe protection
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Social Metrics</h3>
              <p className="text-gray-400">
                Live tracking of mentions, engagement, and social score
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Community Driven</h3>
              <p className="text-gray-400">
                Auto-liquidity, burn mechanics, and creator rewards
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
