import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {

  const rpcProvider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");

  const [walletProvider, setWalletProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [connected, setConnected] = useState(false);

  // Prova a riconnettersi automaticamente al mount, senza aprire popup
  useEffect(() => { tryAutoConnect(); }, []);
  
  async function tryAutoConnect() {
    if (!window.ethereum) return;

    try {
      // eth_accounts NON apre popup: restituisce [] se non autorizzato
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        setWalletProvider(provider);
        setSigner(signer);
        setAddress(accounts[0]);
        setConnected(true);
      }
    } catch (err) {
      console.error("Auto-reconnect fallito:", err);
    }
  }
  

  return (
    <WalletContext.Provider value={{ rpcProvider, walletProvider, signer, address, connected, setWalletProvider, setSigner, setAddress, setConnected }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}