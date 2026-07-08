import './Navbar.css'
import MetaMaskFox from '../assets/MetaMask_Fox.png'
import { shortenAddress } from '../logic/Util'
import { connectWallet } from '../logic/ConnectWallet'
import { useWallet } from '../data/WalletContext'

export default function Navbar({ currentPage, onNavigate }) {
  const { connected, address, setConnected, setAddress, walletProvider, setWalletProvider, setSigner } = useWallet()

  const handleConnect = async () => {
    if (connected) {
      console.log('Wallet already connected:')
      console.log('- Address:', address)
      console.log('- WalletProvider:', walletProvider)
      console.log('- Signer:', setSigner)
      return
    }

    const info = await connectWallet()
    if (info == null) {
      setConnected(false)
    } else {
      setConnected(true)
      setAddress(info.address)
      setWalletProvider(info.provider)
      setSigner(info.signer)
    }
  }

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">
        <button className="navbar-logo-btn" onClick={() => onNavigate('explore')}>
          <span className="navbar-logo-text">BKCH Project</span>
        </button>

        <div className="navbar-nav">
          <button
            className={`navbar-link-btn nav-text-btn ${currentPage === 'explore' ? 'active' : ''}`}
            onClick={() => onNavigate('explore')}
            id="nav-explore"
            title="Explore"
          >
            Explore
          </button>

          <button
            className={`navbar-link-btn nav-text-btn ${currentPage === 'create' ? 'active' : ''}`}
            onClick={() => onNavigate('create')}
            id="nav-create"
          >
            Create
          </button>
        </div>

        <div className="navbar-actions">

          <button
            className={`wallet-btn ${connected ? 'connected' : ''}`}
            onClick={handleConnect}
            id="wallet-connect-btn"
          >
            <img src={MetaMaskFox} alt="MetaMask" className="wallet-icon" />
            {connected ? <span>{shortenAddress(address)}</span> : <span>Connect Wallet</span>}
          </button>

        </div>
      </div>
    </nav>
  )
}