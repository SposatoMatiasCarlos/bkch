import { useState, useEffect } from 'react'
import { getDaysLeft, formatNumber, toMs, getCampaignState } from '../logic/Util'
import { getCampaignBackers, support, withdraw, finalize, claimReward, refund, proposerWithdraw } from '../logic/Campaigns'
import { useWallet } from '../data/WalletContext'
import ProgressBar from '../components/ProgressBar'
import './CampaignDetail.css'

export default function CampaignDetail({ campaign, onBackToExplore }) {

  const [backAmount, setBackAmount] = useState('') // usato dal form
  const [backers, setBackers] = useState([])
  const [txPending, setTxPending] = useState(false)
  const { rpcProvider, signer, connected } = useWallet()


  async function loadBackers() {
    if (!campaign || !rpcProvider) return
    try {
      const data = await getCampaignBackers(rpcProvider, campaign.address)
      setBackers(data)
    } catch (err) {
      console.error("Errore nel caricamento dei backers:", err)
    }
  }

  useEffect(() => { loadBackers() }, [campaign, rpcProvider])

  if (!campaign) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="not-found animate-fade-in">
            <h2 className="not-found-title">Campaign not found</h2>
            <p className="not-found-text">This campaign doesn't exist or has been removed.</p>
            <button className="btn btn-primary" onClick={onBackToExplore}>
              Back to Explore
            </button>
          </div>
        </div>
      </div>
    )
  }

  const {
    isSuccess, isFailed, isInProgress, needsFinalize,
    canBack, canWithdraw, canClaim, canRefund, statusLabel
  } = getCampaignState(campaign)

  const rewardPreview = backAmount && campaign.exchangeRate
    ? (Number(backAmount) * campaign.exchangeRate).toLocaleString()
    : null

  const timeAgo = (timestamp) => {
    const diff = Date.now() - toMs(timestamp)
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  async function runTx(fn) {
    if (!connected){
      alert("Devi connettere il wallet") 
      return; 
    }
    try {
      setTxPending(true)
      await fn()
    } catch (err) {
      console.error(err)
    } finally {
      setTxPending(false)
    }
  }

  return (
    <div className="detail-page" id="detail-page">
      <div className="container">
        <button className="detail-back" onClick={onBackToExplore} id="back-to-explore">
          Back to campaigns
        </button>

        <div className="detail-layout">
          <div className="detail-main">
            <div className="detail-hero animate-fade-in">
              <div className="detail-hero-header">
                <div>
                  <h1 className="detail-title">{campaign.name}</h1>
                  <div className="detail-proposer">
                    Created by
                    <span className="detail-proposer-addr">{campaign.proposer}</span>
                  </div>
                </div>
                <span className={`badge ${isSuccess ? 'badge-funded' : isFailed ? 'badge-ended' : needsFinalize ? 'badge-pending' : 'badge-active'}`}>
                  {statusLabel}
                </span>
              </div>

              <p className="detail-description">{campaign.description}</p>

              <div className="detail-progress-section">
                <div className="detail-progress-header">
                  <div className="detail-raised">
                    {formatNumber(campaign.raised)}
                    <span className="detail-raised-suffix"> {campaign.fundingToken.symbol}</span>
                  </div>
                  <span className="detail-goal">
                    of {formatNumber(campaign.threshold)} {campaign.fundingToken.symbol}
                  </span>
                </div>
                <ProgressBar
                  raised={campaign.raised}
                  threshold={campaign.threshold}
                  symbol={campaign.fundingToken.symbol}
                  size="lg"
                  showLabel={false}
                />
              </div>

              {isSuccess && (
                <div className="detail-status-banner funded">
                  This campaign has been successfully funded! Backers can claim their reward tokens.
                </div>
              )}
              {isFailed && (
                <div className="detail-status-banner ended">
                  This campaign did not reach its goal. Backers can request a refund of their contribution.
                </div>
              )}
              {needsFinalize && (
                <div className="detail-status-banner pending">
                  The deadline has passed. This campaign needs to be finalized before rewards or refunds can be processed.
                </div>
              )}
            </div>

            <div className="detail-tokens animate-fade-in-up">
              <h2 className="detail-section-title">Token Details</h2>
              <div className="detail-token-grid">
                <div className="detail-token-item">
                  <div className="detail-token-label">Funding Token</div>
                  <div className="detail-token-symbol">{campaign.fundingSymbol}</div>
                  <div className="detail-token-address">{campaign.fundingToken}</div>
                </div>
                <div className="detail-token-item">
                  <div className="detail-token-label">Reward Token</div>
                  <div className="detail-token-symbol">{campaign.rewardSymbol}</div>
                  <div className="detail-token-address">{campaign.rewardToken}</div>
                </div>
              </div>
              <div className="detail-exchange-info">
                <div className="detail-exchange-rate">
                  1 {campaign.fundingSymbol} = {campaign.exchangeRate} {campaign.rewardSymbol}
                </div>
                <div className="detail-exchange-label">Exchange Rate</div>
              </div>
            </div>

            <div className="detail-backers animate-fade-in-up">
              <h2 className="detail-section-title">Recent Backers</h2>
              {backers.length > 0 ? (
                <div className="backer-list">
                  {backers.map((backer, i) => (
                    <div className="backer-row" key={`${backer.address}-${backer.timestamp}-${i}`}>
                      <span className="backer-address">{backer.address}</span>
                      <div className="backer-info">
                        <div className="backer-amount">
                          {formatNumber(backer.amount)} {campaign.fundingSymbol}
                        </div>
                        <div className="backer-time">{timeAgo(backer.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="detail-no-backers">No backers yet.</p>
              )}
            </div>
          </div>

          <div className="detail-sidebar">
            <div className="detail-action-card animate-fade-in">

              {isInProgress && !needsFinalize && (
                <>
                  <h3 className="detail-action-title">Back this campaign</h3>
                  <p className="detail-action-desc">
                    Your contribution is protected. You can withdraw anytime before the campaign is finalized.
                  </p>
                  <div className="back-input-group">
                    <div className="back-input-wrapper">
                      <input
                        type="number"
                        className="back-input"
                        placeholder="0.00"
                        min="0"
                        step="any"
                        value={backAmount}
                        onChange={(e) => setBackAmount(e.target.value)}
                        id="back-amount-input"
                      />
                      <span className="back-input-token">{campaign.fundingSymbol}</span>
                    </div>
                    {rewardPreview && (
                      <div className="back-reward-preview">
                        <span className="back-reward-label">You'll receive</span>
                        <span className="back-reward-value">
                          {rewardPreview} {campaign.rewardSymbol}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="detail-action-buttons">
                    <button
                      className="btn btn-primary btn-lg"
                      id="back-campaign-btn"
                      onClick={() => runTx(() => support(signer, campaign.address, backAmount))}
                      disabled={!canBack || txPending || !backAmount}
                    >
                      Back Campaign
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      id="withdraw-btn"
                      onClick={() => runTx(() => withdraw(signer, campaign.address))}
                      disabled={!canWithdraw || txPending}
                    >
                      Withdraw My Contribution
                    </button>
                  </div>
                </>
              )}

              {needsFinalize && (
                <>
                  <h3 className="detail-action-title">Finalization needed</h3>
                  <p className="detail-action-desc">
                    The deadline has passed. Anyone can finalize this campaign to unlock rewards or refunds.
                  </p>
                  <div className="detail-action-buttons">
                    <button
                      className="btn btn-primary btn-lg"
                      id="finalize-btn"
                      onClick={() => runTx(() => finalize(signer, campaign.address))}
                      disabled={txPending}
                    >
                      Finalize Campaign
                    </button>
                    {canWithdraw && (
                      <button
                        className="btn btn-danger btn-sm"
                        id="withdraw-btn"
                        onClick={() => runTx(() => withdraw(signer, campaign.address))}
                        disabled={txPending}
                      >
                        Withdraw My Contribution
                      </button>
                    )}
                  </div>
                </>
              )}

              {isSuccess && (
                <>
                  <h3 className="detail-action-title">Campaign Funded!</h3>
                  <p className="detail-action-desc">
                    {canClaim
                      ? "This campaign reached its goal. Backers can now claim their reward tokens."
                      : "You've already claimed your reward tokens."}
                  </p>
                  <div className="detail-action-buttons">
                    <button
                      className="btn btn-accent btn-lg"
                      id="claim-rewards-btn"
                      onClick={() => runTx(() => claimReward(signer, campaign.address))}
                      disabled={!canClaim || txPending}
                    >
                      {canClaim ? 'Claim Reward Tokens' : 'Already Claimed'}
                    </button>
                  </div>
                </>
              )}

              {isFailed && (
                <>
                  <h3 className="detail-action-title">Campaign Ended</h3>
                  <p className="detail-action-desc">
                    This campaign didn't reach its goal. You can request a refund of your contribution.
                  </p>
                  <div className="detail-action-buttons">
                    <button
                      className="btn btn-outline btn-lg"
                      id="refund-btn"
                      onClick={() => runTx(() => refund(signer, campaign.address))}
                      disabled={!canRefund || txPending}
                    >
                      {canRefund ? 'Request Refund' : 'Nothing to Refund'}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="detail-info-card animate-fade-in">
              <h4 className="detail-info-title">Campaign Info</h4>
              <div className="detail-info-rows">
                <div className="detail-info-row">
                  <span className="detail-info-label">Status</span>
                  <span className="detail-info-value">{statusLabel}</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Deadline</span>
                  <span className="detail-info-value">
                    {new Date(toMs(campaign.deadline)).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Threshold</span>
                  <span className="detail-info-value">
                    {formatNumber(campaign.threshold)} {campaign.fundingToken.symbol}
                  </span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Remaining</span>
                  <span className="detail-info-value">
                    {formatNumber(Math.max(0, campaign.threshold - campaign.raised))} {campaign.fundingToken.symbol}
                  </span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Reward pool</span>
                  <span className="detail-info-value">
                    {formatNumber(campaign.threshold * campaign.exchangeRate)} {campaign.rewardToken.symbol}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}