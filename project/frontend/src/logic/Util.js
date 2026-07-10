import { Interface } from "ethers";
import { CampaignABI } from "../data/abi/CampaignABI"; 

export const CampaignStatus = {
  SUCCESS: 0,
  IN_PROGRESS: 1,
  FAILED: 2,
}

export function getCampaignState(campaign, userAddress) {
  const status = campaign.status
  const isSuccess = status === CampaignStatus.SUCCESS
  const isInProgress = status === CampaignStatus.IN_PROGRESS
  const isFailed = status === CampaignStatus.FAILED
  const deadlinePassed = getDaysLeft(campaign.deadline) === 0
  const isProposer = userAddress && campaign.proposer &&
    userAddress.toLowerCase() === campaign.proposer.toLowerCase()

  const thresholdReached = (campaign.threshold <= campaign.raised); 

  return {
    isSuccess,
    isInProgress,
    isFailed,
    isProposer,
    needsFinalize: isInProgress && (deadlinePassed || thresholdReached),
    statusLabel: isSuccess ? 'Funded' : isFailed ? 'Failed'
      : (isInProgress && (deadlinePassed || thresholdReached)) ? 'Awaiting finalization' : 'Active',
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

export function timeAgo(timestamp) {
  const diff = Date.now() - toMs(timestamp)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

// Gestione Errori


// Interfaccia per decodificare i custom error
const iface = new Interface(CampaignABI);

const errorMessages = {
  CampaignStillInProgress: "La campagna è ancora in corso. Attendi la scadenza per effettuare questa operazione.",
  Unauthorized: "Azione non autorizzata. Solo il creatore può eseguirla.",
  CampaignNotInProgress: "La campagna non è in corso (è terminata o fallita).",
  DeadlineNotReached: "La deadline non è stata ancora superata.",
  DeadlineReached: "La deadline è già stata raggiunta, non puoi più fare questa azione.",
  ThresholdNotMet: "L'obiettivo minimo di raccolta non è stato raggiunto.",
  ThresholdMet: "L'obiettivo è stato raggiunto, non puoi richiedere un rimborso.",
  ZeroAmount: "L'importo deve essere maggiore di zero.",
  NoContribution: "Non risulta alcuna contribuzione da parte di questo wallet.",
  AlreadyClaimed: "I reward token sono già stati riscattati.",
  NothingToWithdraw: "Non ci sono fondi o reward rimasti da prelevare.",
  TransferFailed: "Il trasferimento dei token ERC20 è fallito. Controlla saldi e allowance.",
  TargetExceeded: "L'importo inserito supera la soglia massima stabilita.",
};

export function parseTxError(err) {
  // Utente ha annullato la firma sul wallet
  if (err?.code === "ACTION_REJECTED" || err?.code === 4001) {
    return "Transazione annullata dall'utente.";
  }

  // Cerca i dati raw del revert ovunque possano essere annidati
  const data = err?.data ?? err?.error?.data ?? err?.error?.error?.data ?? err?.info?.error?.data;

  if (data) {
    try {
      const decoded = iface.parseError(data);
      return errorMessages[decoded.name] ?? `Errore contratto: ${decoded.name}`;
    } catch {
      // data presente ma non è un custom error noto all'ABI -> vai al fallback
    }
  }

  return err?.shortMessage || err?.reason || "Si è verificato un errore imprevisto sulla blockchain.";
}