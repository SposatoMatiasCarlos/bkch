import { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {

  const rpcProvider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");

  const [walletProvider, setWalletProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [connected, setConnected] = useState(false);

  return (
    <WalletContext.Provider value={{ rpcProvider, walletProvider, signer, address, connected, setWalletProvider, setSigner, setAddress, setConnected }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}