import { ethers } from "ethers";

export async function connectWallet() {

    if (!window.ethereum) {
        console.error("MetaMask non è installato.");
        alert("Metamask non è installato");
        return null;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();

        return { provider, signer, address, chainId: network.chainId };
    } catch (err) {
        console.error("Errore durante la connessione al wallet:", err);
        return null;
    }
}
