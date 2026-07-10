import { useState } from 'react'
import './CreateCampaign.css'
import { createCampaign } from '../logic/Campaigns'
import { useWallet } from '../data/WalletContext'

export default function CreateCampaign({ onNavigate }) {

  const [showToast, setShowToast] = useState(false);
  const { signer, provider } = useWallet();
  const [form, setForm] = useState({
    name: '',
    description: '',
    fundingTokenAddress: '',
    fundingTokenSymbol: '',
    rewardTokenAddress: '',
    rewardTokenSymbol: '',
    exchangeRate: '',
    threshold: '',
    deadline: '',
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!signer) {
      alert("Devi prima connettere il wallet.");
      return;
    }

    const campaignDetails = {
      name: form.name,
      description: form.description,
      fundingToken: form.fundingTokenAddress,
      rewardToken: form.rewardTokenAddress,
      exchangeRate: BigInt(form.exchangeRate),
      threshold: BigInt(form.threshold),
      deadline: BigInt(Math.floor(new Date(form.deadline).getTime() / 1000)),
    };

    try {
      const { receipt, campaignAddress } = await createCampaign(signer, campaignDetails);

      if (campaignAddress) {
        const details = await getCampaignDetails(provider, campaignAddress);
        console.log("Nuova campagna:", campaignAddress);
        console.log("Dettagli:", details);
      }

      setShowToast(true);
      onNavigate('explore');
    } catch (err) {
      console.error("Creazione campagna fallita:", err);
    }
  };

  const daysUntilDeadline = form.deadline
    ? Math.max(0, Math.ceil((new Date(form.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0

  return (
    <div className="create-page" id="create-page">
      <div className="container">
        <div className="create-header animate-fade-in">
          <h1 className="create-title">Create Campaign</h1>
        </div>

        <form className="create-form" onSubmit={handleSubmit}>
          {/* Campaign Info */}
          <div className="form-section animate-fade-in-up">
            <h2 className="form-section-title">Campaign Info</h2>
            <p className="form-section-desc">
              Give your campaign a clear name and description to attract backers.
            </p>
            <div className="form-fields">
              <div className="form-group">
                <label className="form-label" htmlFor="campaign-name">Campaign Name</label>
                <input
                  type="text"
                  className="form-input"
                  id="campaign-name"
                  name="name"
                  placeholder="e.g. SolarVault Community"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="campaign-desc">Description</label>
                <textarea
                  className="form-input"
                  id="campaign-desc"
                  name="description"
                  placeholder="Describe your project, goals, and how backers benefit..."
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Token Configuration */}
          <div className="form-section animate-fade-in-up">
            <h2 className="form-section-title">Token Configuration</h2>
            <p className="form-section-desc">
              Specify the ERC-20 tokens used for funding contributions and backer rewards.
            </p>
            <div className="form-fields">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="funding-token-addr">Funding Token Address</label>
                  <input
                    type="text"
                    className="form-input"
                    id="funding-token-addr"
                    name="fundingTokenAddress"
                    placeholder="0x..."
                    value={form.fundingTokenAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="funding-token-symbol">Symbol</label>
                  <input
                    type="text"
                    className="form-input"
                    id="funding-token-symbol"
                    name="fundingTokenSymbol"
                    placeholder="e.g. USDC"
                    value={form.fundingTokenSymbol}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="reward-token-addr">Reward Token Address</label>
                  <input
                    type="text"
                    className="form-input"
                    id="reward-token-addr"
                    name="rewardTokenAddress"
                    placeholder="0x..."
                    value={form.rewardTokenAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reward-token-symbol">Symbol</label>
                  <input
                    type="text"
                    className="form-input"
                    id="reward-token-symbol"
                    name="rewardTokenSymbol"
                    placeholder="e.g. SOLAR"
                    value={form.rewardTokenSymbol}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="exchange-rate">Exchange Rate</label>
                <span className="form-hint">
                  How many reward tokens a backer receives per 1 funding token invested
                </span>
                <div className="form-input-group">
                  <input
                    type="number"
                    className="form-input"
                    id="exchange-rate"
                    name="exchangeRate"
                    placeholder="e.g. 5"
                    min="1"
                    step="any"
                    value={form.exchangeRate}
                    onChange={handleChange}
                    required
                  />
                  <span className="form-input-suffix">
                    {form.rewardTokenSymbol || 'RWD'} / {form.fundingTokenSymbol || 'FND'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Settings */}
          <div className="form-section animate-fade-in-up">
            <h2 className="form-section-title">Campaign Settings</h2>
            <p className="form-section-desc">
              Set the funding threshold and deadline. These are enforced on-chain.
            </p>
            <div className="form-fields">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="threshold">Funding Threshold</label>
                  <span className="form-hint">Minimum amount for the campaign to succeed</span>
                  <div className="form-input-group">
                    <input
                      type="number"
                      className="form-input"
                      id="threshold"
                      name="threshold"
                      placeholder="e.g. 50000"
                      min="1"
                      step="any"
                      value={form.threshold}
                      onChange={handleChange}
                      required
                    />
                    <span className="form-input-suffix">{form.fundingTokenSymbol || 'FND'}</span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="deadline">Deadline</label>
                  <span className="form-hint">Campaign closes at the end of this date</span>
                  <input
                    type="date"
                    className="form-input"
                    id="deadline"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            {/* Live Preview */}
            {(form.name || form.threshold) && (
              <div className="create-preview">
                <div className="create-preview-title">Live Preview</div>
                <div className="preview-row">
                  <span className="preview-label">Campaign</span>
                  <span className="preview-value">{form.name || '—'}</span>
                </div>
                <div className="preview-row">
                  <span className="preview-label">Goal</span>
                  <span className="preview-value">
                    {form.threshold ? Number(form.threshold).toLocaleString() : '—'} {form.fundingTokenSymbol || ''}
                  </span>
                </div>
                <div className="preview-row">
                  <span className="preview-label">Reward rate</span>
                  <span className="preview-value">
                    1 {form.fundingTokenSymbol || 'FND'} → {form.exchangeRate || '?'} {form.rewardTokenSymbol || 'RWD'}
                  </span>
                </div>
                <div className="preview-row">
                  <span className="preview-label">Duration</span>
                  <span className="preview-value">
                    {daysUntilDeadline > 0 ? `${daysUntilDeadline} days` : '—'}
                  </span>
                </div>
                <div className="preview-row">
                  <span className="preview-label">Reward tokens needed</span>
                  <span className="preview-value">
                    {form.threshold && form.exchangeRate
                      ? (Number(form.threshold) * Number(form.exchangeRate)).toLocaleString()
                      : '—'}{' '}
                    {form.rewardTokenSymbol || ''}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="create-submit-area animate-fade-in-up">
            <button type="submit" className="btn btn-primary btn-lg" id="submit-campaign">
              Create Campaign
            </button>
            <p className="create-submit-hint">
              You will need to approve the transfer of reward tokens to the contract.
              This ensures backers are guaranteed their rewards upon success.
            </p>
          </div>
        </form>

        {showToast && (
          <div className="toast" role="alert" id="success-toast">
            Campaign created successfully!
          </div>
        )}
      </div>
    </div>
  )
}
