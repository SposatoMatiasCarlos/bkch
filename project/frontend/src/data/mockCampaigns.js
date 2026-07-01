// Mock data for demonstration purposes.
// In production, this data would come from the smart contract events.

export const MOCK_CAMPAIGNS = [
  {
    id: 1,
    name: 'SolarVault',
    description: 'Community-owned solar energy storage network. Backers fund modular battery units deployed across residential rooftops, earning reward tokens redeemable for discounted clean energy credits.',
    proposer: '0x1a2B...9fC4',
    proposerFull: '0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9fC4',
    fundingToken: {
      symbol: 'USDC',
      address: '0xA0b8...4e3B',
      decimals: 18,
    },
    rewardToken: {
      symbol: 'SOLAR',
      address: '0xC3d4...7a2F',
      decimals: 18,
    },
    exchangeRate: 5,
    threshold: 50000,
    raised: 32450,
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    backersCount: 48,
    backers: [
      { address: '0x7f3A...dE21', amount: 5000, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { address: '0x9bC2...4aF7', amount: 3200, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { address: '0x4eD1...8cB3', amount: 2800, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { address: '0x6aF5...1dE9', amount: 1500, timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 2,
    name: 'ArtChain Collective',
    description: 'A decentralized platform for digital artists to fund collaborative art installations. Backers receive unique NFT-linked reward tokens granting access to exclusive virtual galleries.',
    proposer: '0x5e6F...3aB8',
    proposerFull: '0x5e6F7a8B9c0D1e2F3a4B5c6D7e8F9fC41a2B3aB8',
    fundingToken: {
      symbol: 'DAI',
      address: '0xB1c2...5d4E',
      decimals: 18,
    },
    rewardToken: {
      symbol: 'ARTC',
      address: '0xD5e6...9f8A',
      decimals: 18,
    },
    exchangeRate: 10,
    threshold: 25000,
    raised: 25000,
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'funded',
    backersCount: 112,
    backers: [
      { address: '0x2cB4...7eF1', amount: 4000, timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { address: '0x8dA3...5bC6', amount: 2500, timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 3,
    name: 'MedDAO Research',
    description: 'Decentralized medical research funding protocol. Support open-source pharmaceutical research and receive governance tokens for voting on future research directions.',
    proposer: '0x3c4D...1eA6',
    proposerFull: '0x3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9fC41eA6',
    fundingToken: {
      symbol: 'WETH',
      address: '0xE7f8...3b2C',
      decimals: 18,
    },
    rewardToken: {
      symbol: 'MDAO',
      address: '0xF9a0...7d6E',
      decimals: 18,
    },
    exchangeRate: 100,
    threshold: 15,
    raised: 3.8,
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    backersCount: 22,
    backers: [
      { address: '0x1fE5...9aC2', amount: 1.2, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { address: '0x4bD8...2eF7', amount: 0.8, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 4,
    name: 'EduVerse',
    description: 'Blockchain-based educational platform where communities crowdfund free online courses. Reward tokens give backers voting power on curriculum design and early access.',
    proposer: '0x8a9B...5dC2',
    proposerFull: '0x8a9B0c1D2e3F4a5B6c7D8e9F0a1B2c3D4e5F5dC2',
    fundingToken: {
      symbol: 'USDC',
      address: '0xA0b8...4e3B',
      decimals: 18,
    },
    rewardToken: {
      symbol: 'EDU',
      address: '0xA1b2...8c7D',
      decimals: 18,
    },
    exchangeRate: 20,
    threshold: 80000,
    raised: 12000,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    backersCount: 34,
    backers: [
      { address: '0x3eF6...1bA4', amount: 2000, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 5,
    name: 'GreenBuild DAO',
    description: 'Sustainable construction materials fund. Invest in eco-friendly building innovations and earn reward tokens backed by future revenue from green patents.',
    proposer: '0x2d3E...8fA1',
    proposerFull: '0x2d3E4f5A6b7C8d9E0f1A2b3C4d5E6f7A8b9C8fA1',
    fundingToken: {
      symbol: 'DAI',
      address: '0xB1c2...5d4E',
      decimals: 18,
    },
    rewardToken: {
      symbol: 'GRBN',
      address: '0xB2c3...9d8E',
      decimals: 18,
    },
    exchangeRate: 8,
    threshold: 100000,
    raised: 67500,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    backersCount: 89,
    backers: [
      { address: '0x5aC7...3dE2', amount: 10000, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { address: '0x7eB1...4fC8', amount: 7500, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { address: '0x9dA3...6bE5', amount: 5000, timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 6,
    name: 'HarvestPool',
    description: 'Community-run urban farming initiative. Fund hydroponic micro-farms in underserved neighborhoods. Backers receive tokens redeemable for fresh produce deliveries.',
    proposer: '0x6f7A...2cD5',
    proposerFull: '0x6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b1C2d3E2cD5',
    fundingToken: {
      symbol: 'USDC',
      address: '0xA0b8...4e3B',
      decimals: 18,
    },
    rewardToken: {
      symbol: 'HARV',
      address: '0xC3d4...1e0F',
      decimals: 18,
    },
    exchangeRate: 15,
    threshold: 35000,
    raised: 35000,
    deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'funded',
    backersCount: 156,
    backers: [
      { address: '0x8bC2...5aD7', amount: 3000, timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
]

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
