import { useState } from 'react'
import { forceSuccess, forceFailed } from '../logic/Campaigns'
import { useWallet } from '../data/WalletContext'
import './DevTools.css'

export default function DevTools({ campaignAddress, isProposer, onDone }) {
  const { signer } = useWallet()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  if (!isProposer) return null // nascosto  a chi non è il proposer

  async function run(fn) {
    if (!signer) return
    try {
      setPending(true)
      await fn(signer, campaignAddress)
      onDone?.()
    } catch (err) {
      console.error(err)
      alert(err.shortMessage || err.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="devtools">
      <button className="devtools-toggle" onClick={() => setOpen(!open)}>
        +
      </button>
      {open && (
        <div className="devtools-panel">
          <span className="devtools-label">Testing only</span>
          <button disabled={pending} onClick={() => run(forceSuccess)}>
            Force Success
          </button>
          <button disabled={pending} onClick={() => run(forceFailed)}>
            Force Failed
          </button>
        </div>
      )}
    </div>
  )
}