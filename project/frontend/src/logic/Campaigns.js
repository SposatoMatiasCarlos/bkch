import { ethers } from "ethers";
import { CampaignFactoryABI } from "../data/abi/CampaignFactoryABI.js";
import { CampaignABI } from "../data/abi/CampaignABI.js";
import { ERC20ABI } from "../data/abi/ERC20ABI.js";

const FACTORY_ADDRESS = "0x5DE53a395477D8Cb1b4f308dEa3F550635156f6e";

// ------------------------------------------------------------------------ //
// Combina le funzioni per ottenere tutte le campagne con i loro dettagli,
// non uso Promise.all perchè voglio che se fallisce una richiesta le 
// altre vengano comunque restituite
export async function getAllCampaignsWithDetails(provider, userAddress) {
  const addresses = await getAllCampaigns(provider);

  const results = await Promise.allSettled(
    // userAddress serve a recuperare i dati dell'utente rispetto alla campagna
    addresses.map((address) => getCampaignDetails(provider, address, userAddress))
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


export async function getCampaignDetails(provider, campaignAddress, userAddress) {

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

  const fundingTokenContract = new ethers.Contract(fundingToken, ERC20ABI, provider);
  const rewardTokenContract = new ethers.Contract(rewardToken, ERC20ABI, provider);

  const [fundingDecimals, rewardDecimals, fundingSymbol, rewardSymbol] = await Promise.all([
    fundingTokenContract.decimals(),
    rewardTokenContract.decimals(),
    fundingTokenContract.symbol(),
    rewardTokenContract.symbol()
  ])

  // Se l'utente è connesso a un wallet uso il suo indirizzo per 
  // sapere se ha contribuito alla campagna e se ha già reclamato i reward token
  let myContribution = 0n;
  let hasClaimed = false;

  if (userAddress != '') {
    [myContribution, hasClaimed] = await Promise.all([
      campaign.contributions(userAddress),
      campaign.hasClaimed(userAddress)
    ]);
  }

  return {
    address: campaignAddress,
    name,
    description,
    proposer,
    fundingToken,
    fundingSymbol,
    fundingDecimals,
    rewardDecimals,
    rewardToken,
    rewardSymbol,
    threshold: threshold.toString(),
    deadline: deadline.toString(),
    exchangeRate: exchangeRate.toString(),
    raised: totalRaised.toString(),
    status: Number(status),
    myContribution: myContribution.toString(),
    hasClaimed
  };
}

// ------------------------------------------------------------------------ //

// Crea una nuova campagna
//
// - ERC20 e richiede sempre che ci sia stato un approve precedente registrato on-chain,
//   altrimenti la transazione fallisce con errore TransferFailed
//
// - Nota Fix Importante, prima facevo questo errore:
//   const requiredRewards = threshold * exchangeRate;
//   ma threshold era quella che l'utente impostava e non teneva conto dei decimali
//   tuttavia non posso usare un numero di decimali fisso in quanto i token posso avere 
//   ogni volta decimali diversi
export async function createCampaign(signer, campaignDetails) {
  const factory = new ethers.Contract(FACTORY_ADDRESS, CampaignFactoryABI, signer);
  const userAddress = await signer.getAddress();

  // I dati che vengono dal form compilato dall'utente
  const {
    name,
    description,
    fundingToken,
    rewardToken,
    exchangeRate,
    threshold,
    deadline,
  } = campaignDetails;

  // Prima di tutto devo sapere i decimali per poter calcolare la threshold 
  const fundingTokenContract = new ethers.Contract(fundingToken, ERC20ABI, signer);
  const fundingDecimals = await fundingTokenContract.decimals();

  const thresholdWithDecimals = ethers.parseUnits(threshold.toString(), fundingDecimals);

  const params = {
    name, description, fundingToken, rewardToken,
    exchangeRate: BigInt(exchangeRate),
    threshold: thresholdWithDecimals,
    deadline: BigInt(deadline)
  };

  const requiredRewards = await factory.getRequiredRewards(params);

  try {
    const rewardTokenContract = new ethers.Contract(rewardToken, ERC20ABI, signer);

    // Restituisce quanti token un contratto può spendere per conto di un utente
    const allowance = await rewardTokenContract.allowance(userAddress, FACTORY_ADDRESS);
    if (allowance < requiredRewards) {

      // Se il numero di token è minore a quello richiesto allora 
      // l'utente deve autorizzare il contratto a spendere requiredRewards
      const approveTx = await rewardTokenContract.approve(FACTORY_ADDRESS, requiredRewards);
      await approveTx.wait();
    }

    const tx = await factory.createCampaign({
      name,
      description,
      fundingToken,
      rewardToken,
      exchangeRate: BigInt(exchangeRate),
      threshold: thresholdWithDecimals,
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

    return { receipt, campaignAddress, deployBlock: receipt.blockNumber };
  } catch (err) {
    console.error("Errore nella creazione della campagna:", err);
    throw err;
  }
}

// ------------------------------------------------------------------------ //

// Ottiene la lista dei backer di una campagna tramite l'evento Funded 
export async function getCampaignBackers(provider, campaignAddress) {
  const campaign = new ethers.Contract(campaignAddress, CampaignABI, provider);

  // Filtro in base all'evento e ottengo i log,
  // uso deploy_block per limitare la ricerca ai log successivi al deploy del contratto
  const filter = campaign.filters.Funded();
  const events = await campaign.queryFilter(filter, "latest");

  const backers = await Promise.all(
    events.map(async (event) => {
      const block = await event.getBlock();
      return {
        address: event.args.contributor,
        amount: event.args.amount.toString(),
        timestamp: block.timestamp * 1000 // secondi -> millisecondi
      };
    })
  );

  // I più recenti vanno in cima 
  return backers.sort((a, b) => b.timestamp - a.timestamp);
}

// ------------------------------------------------------------------------ //

export async function support(signer, campaignAddress, amount) {
  console.log("Supporting the campaign with: ", amount);
}

export async function withdraw(signer, campaignAddress) {

}

export async function finalize(signer, campaignAddress) {

}

export async function refund(signer, campaignAddress) {

}

export async function claimReward(signer, campaignAddress) {

}


export async function proposerWithdraw(signer, campaignAddress) {

}




