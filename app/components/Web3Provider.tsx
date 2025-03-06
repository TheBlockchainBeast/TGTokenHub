"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  provider: null,
  signer: null,
  connect: async () => {},
  disconnect: () => {},
});

export function useWeb3() {
  return useContext(Web3Context);
}

export default function Web3ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  const connect = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const signer = await provider.getSigner();
        setAccount(accounts[0]);
        setProvider(provider);
        setSigner(signer);
      } catch (error) {
        console.error("Failed to connect:", error);
      }
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      });
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{ account, provider, signer, connect, disconnect }}
    >
      {children}
    </Web3Context.Provider>
  );
}
