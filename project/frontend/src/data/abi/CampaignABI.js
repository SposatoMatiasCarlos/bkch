export const CampaignABI = [
  "function name() view returns (string)",
  "function description() view returns (string)",
  "function proposer() view returns (address)",
  "function fundingToken() view returns (address)",
  "function rewardToken() view returns (address)",
  "function threshold() view returns (uint256)",
  "function deadline() view returns (uint256)",
  "function exchangeRate() view returns (uint256)",
  "function totalRaised() view returns (uint256)",
  "function status() view returns (uint8)", // enum CampaignStatus
  "function contributions(address) view returns (uint256)",
  "function hasClaimed(address) view returns (bool)"
];