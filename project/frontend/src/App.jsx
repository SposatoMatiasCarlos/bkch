import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import StrandsBackground from './components/StrandsBackground'
import ExploreCampaigns from './pages/ExploreCampaigns'
import CreateCampaign from './pages/CreateCampaign'
import CampaignDetail from './pages/CampaignDetail'

export default function App() {
  const [currentPage, setCurrentPage] = useState('explore') // 'explore', 'create', 'detail'
  const [selectedCampaignId, setSelectedCampaignId] = useState(null)

  // Inizializza il tema controllando il localStorage (default: 'dark')
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'dark'
    }

    const storedTheme = localStorage.getItem('theme')
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark'
  })

  // Sincronizza l'attributo data-theme sull'elemento HTML ogni volta che il tema cambia
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Funzione per switchare il tema
  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

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
      <StrandsBackground />
      {/* Passiamo lo stato corrente del tema e la funzione per cambiarlo alla Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
      <main style={{ position: 'relative', zIndex: 1 }}>
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
    </>
  )
}