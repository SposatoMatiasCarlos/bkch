
export const CampaignStatus = {
  SUCCESS: 0,
  IN_PROGRESS: 1,
  FAILED: 2,
}

// Deriva tutti i flag di stato/azioni disponibili da 
export function getCampaignState(campaign) {
  const status = campaign.status
  const isSuccess = status === CampaignStatus.SUCCESS
  const isInProgress = status === CampaignStatus.IN_PROGRESS
  const isFailed = status === CampaignStatus.FAILED

  const deadlinePassed = getDaysLeft(campaign.deadline) === 0
  const myContribution = campaign.myContribution || 0

  return {
    status,
    isSuccess,
    isInProgress,
    isFailed,
    deadlinePassed,
    needsFinalize: isInProgress && deadlinePassed,

    // support(): onlyInProgress + deadline non superata
    canBack: isInProgress && !deadlinePassed,
    // withdraw(): onlyInProgress, deadline irrilevante
    canWithdraw: isInProgress && myContribution > 0,
    // claimRewardToken(): status SUCCESS + !hasClaimed
    canClaim: isSuccess && !campaign.hasClaimed,
    // refund(): status FAILED + contributo > 0
    canRefund: isFailed && myContribution > 0,

    statusLabel: isSuccess ? 'Funded' : isFailed ? 'Failed'
      : (isInProgress && deadlinePassed) ? 'Awaiting finalization' : 'Active',
  }
}

export function getDaysLeft(deadline) {
  const deadlineMs = toMs(deadline)
  const diff = deadlineMs - Date.now()
  if (diff <= 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Converte un timestamp Unix (secondi, come stringa/number/BigInt)
// in millisecondi per l'oggetto Date di JS
export function toMs(timestamp) {
  const n = Number(timestamp)
  return n * 1000
}

export function getProgress(raised, threshold) {
  return Math.min((raised / threshold) * 100, 100)
}

export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}

export function shortenAddress(addr) {
  if (!addr) return ''
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}