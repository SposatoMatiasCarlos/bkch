import { useState, useMemo, useEffect } from 'react'
import { useWallet } from '../data/WalletContext';
import CampaignCard from '../components/CampaignCard'
import { getAllCampaignsWithDetails } from '../logic/Campaigns'
import './ExploreCampaigns.css'

const FILTERS = ['All', 'Active', 'Funded', 'Ended']

export default function ExploreCampaigns({ onSelectCampaign }) {

  const [campaigns, setCampaigns] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All')
  const { rpcProvider } = useWallet()

  useEffect(() => { loadCampaigns(rpcProvider); }, [rpcProvider]);

  async function loadCampaigns() {
    try {
      const data = await getAllCampaignsWithDetails(rpcProvider);
      setCampaigns(data);
      console.log("Campagne caricate: ", data);
    } catch (err) {
      console.error("Errore nel caricamento delle campagne:", err);
    }
  }


  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      if (activeFilter === 'All') return true
      if (activeFilter === 'Active') return c.status === "0"
      if (activeFilter === 'Funded') return c.status === "1"
      if (activeFilter === 'Ended') return c.status === "2"
      return true
    })
  }, [campaigns, activeFilter])

  return (
    <div className="explore-page" id="explore-page">
      <div className="container">
        <div className="explore-header animate-fade-in">
          <h1 className="explore-title">Explore Campaigns</h1>
        </div>

        <div className="explore-toolbar animate-fade-in" style={{ animationDelay: '80ms' }}>
          <div className="filter-tabs">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
                id={`filter-${filter.toLowerCase()}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {filteredCampaigns.length > 0 ? (
          <div className="campaigns-grid">
            {filteredCampaigns.map((campaign, i) => (
              <div key={campaign.address} style={{ animationDelay: `${120 + i * 60}ms` }} className="animate-fade-in-up">
                <CampaignCard campaign={campaign} onSelectCampaign={onSelectCampaign} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results animate-fade-in">
            <div className="no-results-text">No campaigns found</div>
            <div className="no-results-hint">Try adjusting your filters</div>
          </div>
        )}
      </div>
    </div>
  )
}
