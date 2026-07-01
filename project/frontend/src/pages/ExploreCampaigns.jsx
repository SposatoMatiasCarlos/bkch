import { useState, useMemo } from 'react'
import CampaignCard from '../components/CampaignCard'
import { MOCK_CAMPAIGNS } from '../data/mockCampaigns'
import './ExploreCampaigns.css'

const FILTERS = ['All', 'Active', 'Funded', 'Ended']

export default function ExploreCampaigns({ onSelectCampaign }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredCampaigns = useMemo(() => {
    return MOCK_CAMPAIGNS.filter((c) => {
      // Status filter
      if (activeFilter === 'All') return true
      if (activeFilter === 'Active') return c.status === 'active'
      if (activeFilter === 'Funded') return c.status === 'funded'
      if (activeFilter === 'Ended') return c.status === 'ended'
      return true
    })
  }, [activeFilter])

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
              <div key={campaign.id} style={{ animationDelay: `${120 + i * 60}ms` }} className="animate-fade-in-up">
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
