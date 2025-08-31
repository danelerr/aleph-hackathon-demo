"use client"

import { useState } from "react"
import { useDarkMode } from "@/app/page"

interface FeedViewProps {
  onIncidentClick: (incident: any) => void
}

const incidents = [
  {
    id: 1,
    lat: -34.6037,
    lng: -58.3816,
    status: "Sin verificar",
    color: "#6B7280",
    description: "Bache en la vía principal",
    confirmations: 0,
    image: "/pothole-in-street.png",
    user: "Usuario123",
    timestamp: "Hace 2 horas",
    location: "Av. Corrientes 1234",
    likes: 12,
    comments: [
      { id: 1, user: "VecinoActivo", text: "Confirmo, pasé por ahí esta mañana", timestamp: "Hace 1 hora" },
      {
        id: 2,
        user: "ConductorPreocupado",
        text: "Es muy peligroso, especialmente de noche",
        timestamp: "Hace 45 min",
      },
      { id: 3, user: "LocalResident", text: "Ya reporté esto al municipio también", timestamp: "Hace 30 min" },
    ],
  },
  {
    id: 2,
    lat: -34.6118,
    lng: -58.396,
    status: "Necesita confirmación",
    color: "#F59E0B",
    description: "Semáforo dañado en intersección",
    confirmations: 2,
    image: "/broken-traffic-light.png",
    user: "CiudadanoActivo",
    timestamp: "Hace 4 horas",
    location: "Av. Santa Fe y Callao",
    likes: 28,
    comments: [
      { id: 1, user: "TransitoSeguro", text: "Muy peligroso para los peatones", timestamp: "Hace 3 horas" },
      { id: 2, user: "MotoristaUrbano", text: "Casi choco por esto", timestamp: "Hace 2 horas" },
      { id: 3, user: "PeatonCuidadoso", text: "Hay que tener mucho cuidado al cruzar", timestamp: "Hace 1 hora" },
      { id: 4, user: "VecinoSolidario", text: "¿Alguien sabe si ya lo reportaron?", timestamp: "Hace 45 min" },
      { id: 5, user: "CiudadResponsable", text: "Yo también lo confirmo", timestamp: "Hace 30 min" },
      { id: 6, user: "UsuarioPreocupado", text: "Espero que lo arreglen pronto", timestamp: "Hace 15 min" },
      { id: 7, user: "TestigoOcular", text: "Vi el accidente que causó esto", timestamp: "Hace 10 min" },
    ],
  },
  {
    id: 3,
    lat: -34.6158,
    lng: -58.3731,
    status: "Verificado",
    color: "#10B981",
    description: "Alcantarilla sin tapa",
    confirmations: 5,
    image: "/open-manhole-cover.png",
    user: "VecinoPreocupado",
    timestamp: "Hace 1 día",
    location: "Av. Rivadavia 5678",
    likes: 45,
    comments: [],
  },
  {
    id: 4,
    lat: -34.62,
    lng: -58.37,
    status: "Sin verificar",
    color: "#6B7280",
    description: "Árbol caído bloqueando la calle",
    confirmations: 0,
    image: "/pothole-in-street.png",
    user: "ReporteUrgente",
    timestamp: "Hace 30 minutos",
    location: "Calle Defensa 890",
    likes: 8,
    comments: [],
  },
  {
    id: 5,
    lat: -34.608,
    lng: -58.39,
    status: "Necesita confirmación",
    color: "#F59E0B",
    description: "Luminaria pública sin funcionar",
    confirmations: 1,
    image: "/broken-traffic-light.png",
    user: "SeguridadBarrio",
    timestamp: "Hace 6 horas",
    location: "Av. Las Heras 2345",
    likes: 19,
    comments: [],
  },
]

export default function FeedView({ onIncidentClick }: FeedViewProps) {
  const { isDarkMode } = useDarkMode()
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [showComments, setShowComments] = useState<Set<number>>(new Set())
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({})

  const handleLike = (incidentId: number) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(incidentId)) {
        newSet.delete(incidentId)
      } else {
        newSet.add(incidentId)
      }
      return newSet
    })
  }

  const toggleComments = (incidentId: number) => {
    setShowComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(incidentId)) {
        newSet.delete(incidentId)
      } else {
        newSet.add(incidentId)
      }
      return newSet
    })
  }

  const handleAddComment = (incidentId: number) => {
    const comment = newComment[incidentId]?.trim()
    if (comment) {
      console.log(`Adding comment to incident ${incidentId}: ${comment}`)
      setNewComment((prev) => ({ ...prev, [incidentId]: "" }))
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Sin verificar": { bg: "bg-gray-500", text: "Sin verificar" },
      "Necesita confirmación": { bg: "bg-yellow-500", text: "Pendiente" },
      Verificado: { bg: "bg-green-500", text: "Verificado" },
      Rechazado: { bg: "bg-red-500", text: "Rechazado" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Sin verificar"]

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${config.bg}`}>
        {config.text}
      </span>
    )
  }

  return (
    <div className={`flex-1 overflow-y-auto ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {incidents.map((incident, index) => (
          <div
            key={incident.id}
            className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} 
              border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden
              animate-[fadeInUp_0.5s_ease-out]`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Header */}
            <div className="p-4 pb-3" onClick={() => onIncidentClick(incident)}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{incident.user}</p>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {incident.timestamp} • {incident.location}
                    </p>
                  </div>
                </div>
                {getStatusBadge(incident.status)}
              </div>

              <p className={`${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-3`}>{incident.description}</p>
            </div>

            {/* Image */}
            <div className="relative" onClick={() => onIncidentClick(incident)}>
              <img
                src={incident.image || "/placeholder.svg"}
                alt={incident.description}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-3 right-3">
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isDarkMode ? "bg-black bg-opacity-60 text-white" : "bg-white bg-opacity-90 text-gray-800"
                  }`}
                >
                  {incident.confirmations} confirmaciones
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLike(incident.id)
                    }}
                    className={`flex items-center space-x-2 transition-colors duration-200 ${
                      likedPosts.has(incident.id)
                        ? "text-red-500"
                        : isDarkMode
                          ? "text-gray-400 hover:text-red-400"
                          : "text-gray-500 hover:text-red-500"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={likedPosts.has(incident.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {incident.likes + (likedPosts.has(incident.id) ? 1 : 0)}
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleComments(incident.id)
                    }}
                    className={`flex items-center space-x-2 transition-colors duration-200 ${
                      showComments.has(incident.id)
                        ? "text-blue-500"
                        : isDarkMode
                          ? "text-gray-400 hover:text-blue-400"
                          : "text-gray-500 hover:text-blue-500"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="text-sm font-medium">{incident.comments?.length || 0}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Share functionality
                    }}
                    className={`flex items-center space-x-2 transition-colors duration-200 ${
                      isDarkMode ? "text-gray-400 hover:text-green-400" : "text-gray-500 hover:text-green-500"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Compartir</span>
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Confirm incident functionality
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 btn-hover-scale ${
                    isDarkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Confirmar
                </button>
              </div>

              {/* Comments section */}
              {showComments.has(incident.id) && (
                <div className={`mt-4 pt-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  {/* Comments list */}
                  <div className="space-y-3 mb-4">
                    {incident.comments?.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                              {comment.user}
                            </span>
                            <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add comment input */}
                  <div className="flex space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="flex-1 flex space-x-2">
                      <input
                        type="text"
                        placeholder="Agregar un comentario..."
                        value={newComment[incident.id] || ""}
                        onChange={(e) => setNewComment((prev) => ({ ...prev, [incident.id]: e.target.value }))}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleAddComment(incident.id)
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(incident.id)}
                        disabled={!newComment[incident.id]?.trim()}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          newComment[incident.id]?.trim()
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : isDarkMode
                              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Load more button */}
        <div className="flex justify-center py-6">
          <button
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 btn-hover-scale ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
            }`}
          >
            Cargar más reportes
          </button>
        </div>
      </div>
    </div>
  )
}
