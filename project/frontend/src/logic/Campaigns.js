import { ethers } from "ethers";
import { CampaignFactoryABI } from "../data/abi/CampaignFactoryABI.js";
import { CampaignABI } from "../data/abi/CampaignABI.js";
import { ERC20ABI } from "../data/abi/ERC20ABI.js";

const FACTORY_ADDRESS = "0x17e5fB40a6838E03883179A53eD356bBF60a3c6d";

// ------------------------------------------------------------------------ //
// Combina le funzioni per ottenere tutte le campagne con i loro dettagli,
// non uso Promise.all perchè voglio che se fallisce una richiesta le 
// altre vengano comunque restituite
export async function getAllCampaignsWithDetails(provider) {
  const addresses = await getAllCampaigns(provider);

  const results = await Promise.allSettled(
    addresses.map((address) => getCampaignDetails(provider, address))
  );

  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);
}


async function getAllCampaigns(provider) {
  const factory = new ethers.Contract(FACTORY_ADDRESS, CampaignFactoryABI, provider);

  try {
    const addresses = await factory.getCampaigns();
    return addresses;
  } catch (err) {
    console.error("Errore nel recupero delle campagne:", err);
    return [];
  }
}

async function getCampaignDetails(provider, campaignAddress) {
  const campaign = new ethers.Contract(campaignAddress, CampaignABI, provider);

  const [name, description, proposer, fundingToken, rewardToken,
    threshold, deadline, exchangeRate, totalRaised, status] = await Promise.all([
      campaign.name(),
      campaign.description(),
      campaign.proposer(),
      campaign.fundingToken(),
      campaign.rewardToken(),
      campaign.threshold(),
      campaign.deadline(),
      campaign.exchangeRate(),
      campaign.totalRaised(),
      campaign.status()
    ]);

  return {
    address: campaignAddress, name,
    description,
    proposer,
    fundingToken,
    rewardToken,
    threshold: threshold.toString(),
    deadline: deadline.toString(),
    exchangeRate: exchangeRate.toString(),
    totalRaised: totalRaised.toString(),
    status: status.toString()
  };
}

// ------------------------------------------------------------------------ //

// Crea una nuova campagna
// ERC20 e richiede sempre che ci sia stato un approve precedente registrato on-chain,
// altrimenti la transazione fallisce con errore TransferFailed
export async function createCampaign(signer, campaignDetails) {
  const factory = new ethers.Contract(FACTORY_ADDRESS, CampaignFactoryABI, signer);
  const userAddress = await signer.getAddress();

  const {
    name,
    description,
    fundingToken,
    rewardToken,
    exchangeRate,
    threshold,
    deadline
  } = campaignDetails;

  const requiredRewards = threshold * exchangeRate;

  try {
    const rewardTokenContract = new ethers.Contract(rewardToken, ERC20ABI, signer);

    const allowance = await rewardTokenContract.allowance(userAddress, FACTORY_ADDRESS);
    if (allowance < requiredRewards) {
      const approveTx = await rewardTokenContract.approve(FACTORY_ADDRESS, requiredRewards);
      await approveTx.wait();
    }

    const tx = await factory.createCampaign({
      name,
      description,
      fundingToken,
      rewardToken,
      exchangeRate,
      threshold,
      deadline
    });

    const receipt = await tx.wait();

    const event = receipt.logs
      .map((log) => {
        try {
          return factory.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((parsed) => parsed?.name === 'CampaignCreated');

    const campaignAddress = event?.args?.campaign ?? null;

    return { receipt, campaignAddress };
  } catch (err) {
    console.error("Errore nella creazione della campagna:", err);
    throw err;
  }
}