"use client"

import { useState } from "react"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"
import { useDarkMode } from "@/app/page"

interface FilterSectionProps {
  onFilterChange: (status: string) => void
}

export default function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isExpanded, setIsExpanded] = useState(false)
  const { isDarkMode } = useDarkMode()

  const filters = [
    { id: "all", label: "Todos", color: "bg-gray-600" },
    { id: "pending", label: "Pendiente", color: "bg-yellow-500" },
    { id: "verified", label: "Verificado", color: "bg-green-500" },
    { id: "rejected", label: "Rechazado", color: "bg-red-500" },
  ]

  const handleFilterClick = (filterId: string) => {
    setSelectedFilter(filterId)
    onFilterChange(filterId)
    setIsExpanded(false) // Close filter after selection
  }

  const selectedFilterData = filters.find((f) => f.id === selectedFilter)

  return (
    <div className={`${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"} border-b`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-4 py-2 flex items-center justify-between hover:${isDarkMode ? "bg-gray-700" : "bg-gray-50"} transition-colors`}
      >
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${selectedFilterData?.color}`}></div>
            <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {selectedFilterData?.label}
            </span>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
        ) : (
          <ChevronDown className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterClick(filter.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedFilter === filter.id
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${filter.color}`}></div>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
