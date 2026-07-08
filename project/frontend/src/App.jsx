import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import StrandsBackground from './components/StrandsBackground'
import ExploreCampaigns from './pages/ExploreCampaigns'
import CreateCampaign from './pages/CreateCampaign'
import CampaignDetail from './pages/CampaignDetail'
import { WalletProvider } from './data/WalletContext'

export default function App() {
  const [currentPage, setCurrentPage] = useState('explore')
  const [selectedCampaignId, setSelectedCampaignId] = useState(null)

  const handleNavigate = (page) => {
    setCurrentPage(page)
    if (page !== 'detail') {
      setSelectedCampaignId(null)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectCampaign = (id) => {
    setSelectedCampaignId(id)
    setCurrentPage('detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <WalletProvider>
        <StrandsBackground />

        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="app-main">
          {currentPage === 'explore' && (
            <ExploreCampaigns onSelectCampaign={handleSelectCampaign} />
          )}
          {currentPage === 'create' && (
            <CreateCampaign onNavigate={handleNavigate} />
          )}
          {currentPage === 'detail' && (
            <CampaignDetail
              campaignId={selectedCampaignId}
              onBackToExplore={() => handleNavigate('explore')}
            />
          )}
        </main>


      </WalletProvider>
    </>
  )
}