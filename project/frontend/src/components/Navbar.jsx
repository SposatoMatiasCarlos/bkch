import { useState } from 'react'
import './Navbar.css'
import ThemeSwitch from './ThemeSwitch'
import MetaMaskFox from '../assets/MetaMask_Fox.png'

export default function Navbar({ currentPage, onNavigate, theme, onToggleTheme }) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState('')

  const handleConnect = () => {
    if (connected) {
      setConnected(false)
      setAddress('')
    } else {
      setConnected(true)
      setAddress('0x7f3A...dE21')
    }
  }

  return (
    <nav className="navbar" id="main-navbar">
      {/* SVG gradients for metallic rendering */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="metallic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#D8D8D8" />
            <stop offset="50%" stopColor="#9C9C9C" />
            <stop offset="75%" stopColor="#E6E6E6" />
            <stop offset="100%" stopColor="#7F7F7F" />
          </linearGradient>
        </defs>
      </svg>

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
            {connected ? (
              <>
                <img src={MetaMaskFox} alt="MetaMask" className="wallet-icon" />
                <span>{address}</span>
              </>
            ) : (
              <>
                <img src={MetaMaskFox} alt="MetaMask" className="wallet-icon" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>

          {/* Pulsante del Tema Premium ed Essenziale */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeSwitch checked={theme === 'dark'} onChange={onToggleTheme} />
          </div>

     
        </div>
      </div>
    </nav>
  )
}