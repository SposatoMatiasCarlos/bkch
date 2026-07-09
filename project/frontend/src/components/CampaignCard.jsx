import { getCampaignState } from '../logic/Util'
import ProgressBar from './ProgressBar'
import './CampaignCard.css'

export default function CampaignCard({ campaign, onSelectCampaign }) {
  const { isFailed, needsFinalize, statusLabel } = getCampaignState(campaign)

  const statusBadge = isFailed
    ? { className: 'badge badge-ended', text: 'Failed' }
    : needsFinalize
    ? { className: 'badge badge-pending', text: 'Awaiting finalization' }
    : { className: 'badge badge-active', text: statusLabel }

  const handleCardClick = () => {
    onSelectCampaign(campaign)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSelectCampaign(campaign)
    }
  }

  return (
    <div
      className="card campaign-card animate-fade-in"
      onClick={handleCardClick}
      id={`campaign-card-${campaign.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="campaign-card-header">
        <h3 className="campaign-card-title">{campaign.name}</h3>
        <span className={statusBadge.className}>{statusBadge.text}</span>
      </div>

      <div className="campaign-card-tokens">
        <span className="token-pill">{campaign.fundingSymbol}</span>
        <span className="token-pill">{campaign.rewardSymbol}</span>
      </div>

      <p className="campaign-card-desc">{campaign.description}</p>

      <div className="campaign-card-progress">
        <ProgressBar raised={Number(campaign.raised)} threshold={Number(campaign.threshold)} symbol={campaign.symbol} />
      </div>
    </div>
  )
}