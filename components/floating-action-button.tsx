"use client"

import { useDarkMode } from "@/app/page"

interface FloatingActionButtonProps {
  onClick: () => void
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  const { isDarkMode } = useDarkMode()

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        className={`relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group overflow-hidden ${
          isDarkMode
            ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500"
        } hover:scale-110 hover:shadow-3xl active:scale-95`}
      >
        {/* Ripple effect background */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 animate-ping" />

        {/* Plus icon with enhanced animation */}
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10 group-hover:rotate-90 transition-all duration-300 drop-shadow-sm"
        >
          <line x1="14" y1="6" x2="14" y2="22"></line>
          <line x1="6" y1="14" x2="22" y2="14"></line>
        </svg>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full opacity-60 animate-bounce"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute bottom-3 left-3 w-1 h-1 bg-white rounded-full opacity-40 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute top-4 left-2 w-0.5 h-0.5 bg-white rounded-full opacity-50 animate-bounce"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </button>

      {/* Tooltip */}
      <div
        className={`absolute bottom-full right-0 mb-2 px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 pointer-events-none ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-gray-900 text-white"
        }`}
      >
        Reportar incidente
        <div
          className={`absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
            isDarkMode ? "border-t-gray-800" : "border-t-gray-900"
          }`}
        />
      </div>
    </div>
  )
}
