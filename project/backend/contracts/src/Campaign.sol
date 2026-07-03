// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.34;

import "./CampaignHeader.sol";

contract Campaign {
    
    address public immutable proposer;
    IERC20  public immutable fundingToken;
    IERC20  public immutable rewardToken;
    uint256 public immutable threshold;
    uint256 public immutable deadline;
    uint256 public immutable exchangeRate;

    uint256 public totalRaised;
    CampaignStatus public status;

    mapping(address => uint256) public contributions;
    mapping(address => bool) public hasClaimed;

    modifier onlyProposer() {
        if (msg.sender != proposer) revert Unauthorized(msg.sender, proposer);
        _;
    }

    modifier onlyInProgress() {
        if (status != CampaignStatus.IN_PROGRESS)
            revert CampaignNotInProgress();
        _;
    }

    constructor(address _proposer, CampaignParams memory params) {
        proposer = _proposer;
        fundingToken = params.fundingToken;
        rewardToken = params.rewardToken;
        threshold = params.threshold;
        deadline = params.deadline;
        exchangeRate = params.exchangeRate;
        status = CampaignStatus.IN_PROGRESS;
    }

    // ---------------------------------------------------------- //

    function support(uint256 amount) external onlyInProgress {
        if (amount == 0) revert ZeroAmount();
        if (block.timestamp >= deadline) revert DeadlineReached(block.timestamp, deadline);
    
        // Controlla che non si superi la soglia massima coperta dai reward token depositati
        if (totalRaised + amount > threshold) revert TargetExceeded(); 

        contributions[msg.sender] += amount;
        totalRaised += amount;

        bool ok = fundingToken.transferFrom(msg.sender, address(this), amount);
        if (!ok) revert TransferFailed();

        emit Funded(msg.sender, amount);
    }

    function withdraw() external onlyInProgress {
        uint256 amount = contributions[msg.sender];
        if (amount == 0) revert NoContribution();

        contributions[msg.sender] = 0;
        totalRaised -= amount;

        bool ok = fundingToken.transfer(msg.sender, amount);
        if (!ok) revert TransferFailed();

        emit Withdrawn(msg.sender, amount);
    }

    function finalize() external onlyInProgress {
        if (block.timestamp < deadline) revert DeadlineNotReached(block.timestamp, deadline);

        status = totalRaised >= threshold ? CampaignStatus.SUCCESS : CampaignStatus.FAILED;
        emit CampaignFinalized(status);
    }

    function claimRewardToken() external {
        if (status != CampaignStatus.SUCCESS) revert ThresholdNotMet();
        if (hasClaimed[msg.sender]) revert AlreadyClaimed();

        uint256 contributed = contributions[msg.sender];
        if (contributed == 0) revert NoContribution();

        hasClaimed[msg.sender] = true;
        uint256 reward = contributed * exchangeRate;

        bool ok = rewardToken.transfer(msg.sender, reward);
        if (!ok) revert TransferFailed();

        emit RewardClaimed(msg.sender, reward);
    }

    function refund() external {
        if (status != CampaignStatus.FAILED) revert ThresholdMet();

        uint256 contributed = contributions[msg.sender];
        if (contributed == 0) revert NoContribution();

        contributions[msg.sender] = 0;

        bool ok = fundingToken.transfer(msg.sender, contributed);
        if (!ok) revert TransferFailed();

        emit Refunded(msg.sender, contributed);
    }

    function proposerWithdraw() external onlyProposer {
        
        if (status == CampaignStatus.SUCCESS) {
            uint256 amount = totalRaised;
            if (amount == 0) revert NothingToWithdraw();
            totalRaised = 0;
            bool ok = fundingToken.transfer(proposer, amount);
            if (!ok) revert TransferFailed();

            emit ProposerWithdrawn(amount);
        
        } 
        else if (status == CampaignStatus.FAILED) {
    
            uint256 remainingRewards = rewardToken.balanceOf(address(this));
            if (remainingRewards == 0) revert NothingToWithdraw();

            bool ok = rewardToken.transfer(proposer, remainingRewards);
            if (!ok) revert TransferFailed();
        } 
        else revert CampaignStillInProgress();

    }

}