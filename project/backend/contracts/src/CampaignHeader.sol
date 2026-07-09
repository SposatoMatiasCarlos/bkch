// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.34;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

// --------------------------- Errors --------------------------- //

error Unauthorized(address sender, address owner);
error InvalidFundingToken(IERC20 token);
error InvalidRewardToken(IERC20 token);
error IdenticalTokens();
error InvalidThreshold();
error InvalidExchangeRate();
error InvalidDeadline(uint256 currentTimestamp, uint256 providedDeadline);
error EmptyName();
error EmptyDescription();

error AlreadyInitialized();
error CampaignNotInProgress();
error DeadlineNotReached(uint256 currentTimestamp, uint256 deadline);
error DeadlineReached(uint256 currentTimestamp, uint256 deadline);
error ThresholdNotMet();
error ThresholdMet();
error ZeroAmount();
error NoContribution();
error AlreadyClaimed();
error NothingToWithdraw();
error TransferFailed();
error TargetExceeded();
error CampaignStillInProgress();

// --------------------------- Enums ---------------------------- //

enum CampaignStatus {
    SUCCESS,
    IN_PROGRESS,
    FAILED
}

// --------------------------- Structs -------------------------- //

struct CampaignParams {
    string name;
    string description;
    IERC20 fundingToken;
    IERC20 rewardToken;
    uint256 exchangeRate;
    uint256 threshold;
    uint256 deadline;
}

// --------------------------- Events --------------------------- //

event CampaignCreated(address newCampaign, address sender, string name);
event Funded(address indexed contributor, uint256 amount);
event Withdrawn(address indexed contributor, uint256 amount);
event CampaignFinalized(CampaignStatus status);
event RewardClaimed(address indexed contributor, uint256 amount);
event ProposerWithdrawn(uint256 amount);
event Refunded(address indexed contributor, uint256 amount);

// ---------------------------- Helpers ------------------------------ //

function _convertToReward(uint256 fundingAmount, uint256 exchangeRate, 
                          IERC20  fundingToken,  IERC20  rewardToken) view returns (uint256) {
    uint8 fundingDecimals = IERC20Metadata(address(fundingToken)).decimals();
    uint8 rewardDecimals = IERC20Metadata(address(rewardToken)).decimals();
    return (fundingAmount * exchangeRate * (10 ** rewardDecimals)) / (10 ** fundingDecimals);
}

function _getRequiredRewards(CampaignParams memory params) view returns (uint256) {
    return _convertToReward(params.threshold, params.exchangeRate, params.fundingToken, params.rewardToken);
}
