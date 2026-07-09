import { useState, useEffect } from 'react'
import { useWallet } from '../data/WalletContext'
import CampaignCard from '../components/CampaignCard'
import { getAllCampaignsWithDetails } from '../logic/Campaigns'
import './ExploreCampaigns.css'

export default function ExploreCampaigns({ onSelectCampaign }) {
  const [campaigns, setCampaigns] = useState([])
  const { rpcProvider, address } = useWallet()

  useEffect(() => { loadCampaigns() }, [rpcProvider, address])

  async function loadCampaigns() {
    try {
      const data = await getAllCampaignsWithDetails(rpcProvider, address)
      console.log('Campagne caricate:', data)
      setCampaigns(data)
    } catch (err) {
      console.error('Errore nel caricamento delle campagne:', err)
    }
  }

  return (
    <div className="explore-page" id="explore-page">
      <div className="container">
        <div className="explore-header animate-fade-in">
          <h1 className="explore-title">Explore Campaigns</h1>
        </div>

        {campaigns.length > 0 ? (
          <div className="campaigns-grid">
            {campaigns.map((campaign) => (
              <div key={campaign.address} className="animate-fade-in-up">
                <CampaignCard campaign={campaign} onSelectCampaign={onSelectCampaign} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results animate-fade-in">
            <div className="no-results-text">No campaigns found</div>
          </div>
        )}
      </div>
    </div>
  )
}
