"use client"

import { useState, createContext, useContext } from "react"
import Header from "../components/header"
import FilterSection from "../components/filter-section"
import MapArea from "../components/map-area"
import FeedView from "../components/feed-view"
import FloatingActionButton from "../components/floating-action-button"
import FloatingLocationButton from "../components/floating-location-button"
import ReportModal from "../components/report-modal"
import IncidentModal from "../components/incident-modal"
import { Toaster } from "sonner"
import { WalletProvider } from "../contexts/wallet-context"

const DarkModeContext = createContext({
  isDarkMode: true,
  toggleDarkMode: () => {},
})

export const useDarkMode = () => useContext(DarkModeContext)

export default function VigiaApp() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [currentView, setCurrentView] = useState<"map" | "feed">("map")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const handlePinClick = (incident: any) => {
    setSelectedIncident(incident)
    setIsIncidentModalOpen(true)
  }

  const handleFilterChange = (status: string) => {
    setSelectedFilter(status)
  }

  const handleLocationObtained = (location: { lat: number; lng: number }) => {
    setUserLocation(location)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <WalletProvider>
      <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
        <div className={`h-screen flex flex-col ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <Header />
        <FilterSection onFilterChange={handleFilterChange} />

        <div className={`flex ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b`}>
          <button
            onClick={() => setCurrentView("map")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 relative ${
              currentView === "map"
                ? isDarkMode
                  ? "text-blue-400 bg-gray-700"
                  : "text-blue-600 bg-blue-50"
                : isDarkMode
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <span>Mapa</span>
            </div>
            {currentView === "map" && (
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDarkMode ? "bg-blue-400" : "bg-blue-600"} animate-[scaleIn_0.2s_ease-out]`}
              />
            )}
          </button>

          <button
            onClick={() => setCurrentView("feed")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 relative ${
              currentView === "feed"
                ? isDarkMode
                  ? "text-blue-400 bg-gray-700"
                  : "text-blue-600 bg-blue-50"
                : isDarkMode
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span>Feed</span>
            </div>
            {currentView === "feed" && (
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDarkMode ? "bg-blue-400" : "bg-blue-600"} animate-[scaleIn_0.2s_ease-out]`}
              />
            )}
          </button>
        </div>

        {currentView === "map" ? (
          <MapArea 
            onPinClick={handlePinClick} 
            selectedFilter={selectedFilter}
            userLocation={userLocation}
          />
        ) : (
          <FeedView onIncidentClick={handlePinClick} />
        )}

        <FloatingLocationButton onLocationObtained={handleLocationObtained} />
        <FloatingActionButton onClick={() => setIsReportModalOpen(true)} />

        <ReportModal 
          isOpen={isReportModalOpen} 
          onClose={() => setIsReportModalOpen(false)} 
          location={userLocation || undefined}
        />

        <IncidentModal
          isOpen={isIncidentModalOpen}
          onClose={() => setIsIncidentModalOpen(false)}
          incident={selectedIncident}
        />

        {/* Toaster para notificaciones */}
        <Toaster position="bottom-right" richColors />
      </div>
    </DarkModeContext.Provider>
    </WalletProvider>
  )
}
