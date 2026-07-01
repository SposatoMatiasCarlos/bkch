import { getProgress, formatNumber } from '../data/mockCampaigns'
import './ProgressBar.css'

export default function ProgressBar({ raised, threshold, symbol, size = 'default', showLabel = true }) {
  const progress = getProgress(raised, threshold)
  const isFunded = progress >= 100

  return (
    <div className="progress-bar-wrapper">
      <div className={`progress-track ${size === 'lg' ? 'lg' : ''}`}>
        <div
          className={`progress-fill ${isFunded ? 'funded' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {showLabel && (
        <div className="progress-label">
          <span className={`progress-percent ${isFunded ? 'funded' : ''}`}>
            {progress.toFixed(0)}%
          </span>
          <span className="progress-amount">
            {formatNumber(raised)} / {formatNumber(threshold)} {symbol}
          </span>
        </div>
      )}
    </div>
  )
}
