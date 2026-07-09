// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.34;

import "./Campaign.sol";
import "./CampaignHeader.sol"; 

contract CampaignFactory {
    
    // -------------------------------------------------------------- //

    address[] public campaigns;

    modifier validateCampaignInputs(CampaignParams memory params) {
        
        if (address(params.fundingToken) == address(0)) revert InvalidFundingToken(params.fundingToken);
        if (address(params.rewardToken) == address(0)) revert InvalidRewardToken(params.rewardToken);
        if (address(params.fundingToken) == address(params.rewardToken)) revert IdenticalTokens();
        
        if (params.threshold == 0) revert InvalidThreshold();
        if (params.exchangeRate == 0) revert InvalidExchangeRate();
        
        if (params.deadline <= block.timestamp) revert InvalidDeadline(block.timestamp, params.deadline);

        if (bytes(params.name).length == 0) revert EmptyName();
        if (bytes(params.description).length == 0) revert EmptyDescription();
        
        _; 
    }

    function getRequiredRewards(CampaignParams memory params) external view returns (uint256) {
        return _getRequiredRewards(params); 
    }

    // -------------------------------------------------------------- //

    // Creates a new campaign    
    function createCampaign(CampaignParams memory params) external validateCampaignInputs(params) {
        
        uint256 requiredRewards = _getRequiredRewards(params);
        
        //   Fixed: Questo calcolo non tiene in considerazione i decimali dei token
        //   uint256 requiredRewards = params.threshold * params.exchangeRate;

        Campaign newCampaign = new Campaign(msg.sender, params);
        campaigns.push(address(newCampaign));

        bool ok = params.rewardToken.transferFrom(msg.sender, address(newCampaign), requiredRewards);
        if (!ok) revert TransferFailed();

        emit CampaignCreated(address(newCampaign), msg.sender, params.name);
    }

    // Returns all the existing campaigns
    function getCampaigns() external view returns (address[] memory) {
        return campaigns;
    }
}
