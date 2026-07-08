
export function getCampaignById(id) {
  return MOCK_CAMPAIGNS.find(c => c.id === Number(id))
}

export function getDaysLeft(deadline) {
  const diff = new Date(deadline) - new Date()
  if (diff <= 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
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