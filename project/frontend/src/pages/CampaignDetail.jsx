import { useState } from 'react'
import { getCampaignById, getDaysLeft, getProgress, formatNumber } from '../logic/Util'
import ProgressBar from '../components/ProgressBar'
import './CampaignDetail.css'

export default function CampaignDetail({ campaignId, onBackToExplore }) {
  const campaign = getCampaignById(campaignId)
  const [backAmount, setBackAmount] = useState('')

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

  const daysLeft = getDaysLeft(campaign.deadline)
  const progress = getProgress(campaign.raised, campaign.threshold)
  const isFunded = campaign.status === 'funded'
  const isEnded = !isFunded && daysLeft === 0
  const isActive = !isFunded && !isEnded

  const rewardPreview = backAmount && campaign.exchangeRate
    ? (Number(backAmount) * campaign.exchangeRate).toLocaleString()
    : null

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  return (
    <div className="detail-page" id="detail-page">
      <div className="container">
        <button className="detail-back" onClick={onBackToExplore} id="back-to-explore">
          Back to campaigns
        </button>

        <div className="detail-layout">
          {/* Main Column */}
          <div className="detail-main">
            {/* Hero */}
            <div className="detail-hero animate-fade-in">
              <div className="detail-hero-header">
                <div>
                  <h1 className="detail-title">{campaign.name}</h1>
                  <div className="detail-proposer">
                    Created by
                    <span className="detail-proposer-addr">{campaign.proposer}</span>
                  </div>
                </div>
                <span className={`badge ${isFunded ? 'badge-funded' : isEnded ? 'badge-ended' : 'badge-active'}`}>
                  {isFunded ? 'Funded' : isEnded ? 'Ended' : 'Active'}
                </span>
              </div>

              <p className="detail-description">{campaign.description}</p>

              {/* Progress */}
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

              {/* Status Banner */}
              {isFunded && (
                <div className="detail-status-banner funded">
                  This campaign has been successfully funded! Backers will receive their reward tokens.
                </div>
              )}
              {isEnded && (
                <div className="detail-status-banner ended">
                  This campaign has ended without reaching its goal. All backers have been refunded.
                </div>
              )}
            </div>

            {/* Token Info */}
            <div className="detail-tokens animate-fade-in-up" style={{ animationDelay: '80ms' }}>
              <h2 className="detail-section-title">Token Details</h2>
              <div className="detail-token-grid">
                <div className="detail-token-item">
                  <div className="detail-token-label">Funding Token</div>
                  <div className="detail-token-symbol">{campaign.fundingToken.symbol}</div>
                  <div className="detail-token-address">{campaign.fundingToken.address}</div>
                </div>
                <div className="detail-token-item">
                  <div className="detail-token-label">Reward Token</div>
                  <div className="detail-token-symbol">{campaign.rewardToken.symbol}</div>
                  <div className="detail-token-address">{campaign.rewardToken.address}</div>
                </div>
              </div>
              <div className="detail-exchange-info">
                <div className="detail-exchange-rate">
                  1 {campaign.fundingToken.symbol} = {campaign.exchangeRate} {campaign.rewardToken.symbol}
                </div>
                <div className="detail-exchange-label">Exchange Rate</div>
              </div>
            </div>

            {/* Recent Backers */}
            <div className="detail-backers animate-fade-in-up" style={{ animationDelay: '160ms' }}>
              <h2 className="detail-section-title">Recent Backers</h2>
              <div className="backer-list">
                {campaign.backers.map((backer, i) => (
                  <div className="backer-row" key={i}>
                    <span className="backer-address">{backer.address}</span>
                    <div className="backer-info">
                      <div className="backer-amount">
                        {formatNumber(backer.amount)} {campaign.fundingToken.symbol}
                      </div>
                      <div className="backer-time">{timeAgo(backer.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            {/* Action Card */}
            <div className="detail-action-card animate-fade-in" style={{ animationDelay: '100ms' }}>
              {isActive ? (
                <>
                  <h3 className="detail-action-title">Back this campaign</h3>
                  <p className="detail-action-desc">
                    Your contribution is protected. You can withdraw anytime before the campaign succeeds.
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
                      <span className="back-input-token">{campaign.fundingToken.symbol}</span>
                    </div>
                    {rewardPreview && (
                      <div className="back-reward-preview">
                        <span className="back-reward-label">You'll receive</span>
                        <span className="back-reward-value">
                          {rewardPreview} {campaign.rewardToken.symbol}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="detail-action-buttons">
                    <button className="btn btn-primary btn-lg" id="back-campaign-btn">
                      Back Campaign
                    </button>
                    <button className="btn btn-danger btn-sm" id="withdraw-btn">
                      Withdraw My Contribution
                    </button>
                  </div>
                </>
              ) : isFunded ? (
                <>
                  <h3 className="detail-action-title">Campaign Funded!</h3>
                  <p className="detail-action-desc">
                    This campaign reached its goal. Backers can now claim their reward tokens.
                  </p>
                  <div className="detail-action-buttons">
                    <button className="btn btn-accent btn-lg" id="claim-rewards-btn">
                      Claim Reward Tokens
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="detail-action-title">Campaign Ended</h3>
                  <p className="detail-action-desc">
                    This campaign didn't reach its goal. All contributions have been refunded to backers.
                  </p>
                  <div className="detail-action-buttons">
                    <button className="btn btn-outline btn-lg" disabled>
                      Refund Processed
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Info Card */}
            <div className="detail-info-card animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h4 className="detail-info-title">Campaign Info</h4>
              <div className="detail-info-rows">
                <div className="detail-info-row">
                  <span className="detail-info-label">Status</span>
                  <span className="detail-info-value">
                    {isFunded ? 'Funded' : isEnded ? 'Ended' : 'Active'}
                  </span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Deadline</span>
                  <span className="detail-info-value">
                    {new Date(campaign.deadline).toLocaleDateString('en-GB', {
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
