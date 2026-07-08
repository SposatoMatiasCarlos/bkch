import { getDaysLeft, formatNumber } from '../logic/Util'
import ProgressBar from './ProgressBar'
import './CampaignCard.css'

export default function CampaignCard({ campaign, onSelectCampaign }) {
  const daysLeft = getDaysLeft(campaign.deadline)
  const isFunded = campaign.status === 'funded'

  const statusBadge = isFunded
    ? { className: 'badge badge-funded', text: 'Funded' }
    : daysLeft <= 3 && daysLeft > 0
    ? { className: 'badge badge-warning', text: `${daysLeft}d left` }
    : daysLeft === 0
    ? { className: 'badge badge-ended', text: 'Ended' }
    : { className: 'badge badge-active', text: 'Active' }

  const handleCardClick = () => {
    onSelectCampaign(campaign.id)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSelectCampaign(campaign.id)
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
        <span className="token-pill">{campaign.fundingToken.symbol}</span>
        <span className="token-pill">{campaign.rewardToken.symbol}</span>
      </div>

      <p className="campaign-card-desc">{campaign.description}</p>

      <div className="campaign-card-progress">
        <ProgressBar raised={Number(campaign.raised)} threshold={Number(campaign.threshold)} symbol={campaign.symbol} />
      </div>
    </div>
  )
}
