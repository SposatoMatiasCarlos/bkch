export const CampaignABI = [
  // --- Storage / Getters (immutable & state) ---
  "function name() view returns (string)",
  "function description() view returns (string)",
  "function proposer() view returns (address)",
  "function fundingToken() view returns (address)",
  "function rewardToken() view returns (address)",
  "function threshold() view returns (uint256)",
  "function deadline() view returns (uint256)",
  "function exchangeRate() view returns (uint256)",
  "function totalRaised() view returns (uint256)",
  "function status() view returns (uint8)", // enum CampaignStatus: 0=IN_PROGRESS,1=SUCCESS,2=FAILED
  "function contributions(address) view returns (uint256)",
  "function hasClaimed(address) view returns (bool)",

  // State changing functions
  "function support(uint256 amount) external",
  "function withdraw() external",
  "function finalize() external",
  "function claimRewardToken() external",
  "function refund() external",
  "function proposerWithdraw() external",

  // Events
  "event Funded(address indexed backer, uint256 amount)",
  "event Withdrawn(address indexed backer, uint256 amount)",
  "event CampaignFinalized(uint8 status)",
  "event RewardClaimed(address indexed backer, uint256 reward)",
  "event Refunded(address indexed backer, uint256 amount)",
  "event ProposerWithdrawn(uint256 amount)",

  // --- Custom Errors ---
  "error Unauthorized(address caller, address expected)",
  "error CampaignNotInProgress()",
  "error ZeroAmount()",
  "error DeadlineReached(uint256 currentTime, uint256 deadline)",
  "error TargetExceeded()",
  "error TransferFailed()",
  "error NoContribution()",
  "error DeadlineNotReached(uint256 currentTime, uint256 deadline)",
  "error ThresholdNotMet()",
  "error AlreadyClaimed()",
  "error ThresholdMet()",
  "error NothingToWithdraw()",
  "error CampaignStillInProgress()"
];