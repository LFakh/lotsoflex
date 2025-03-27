"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface Provider {
  provider_id: number
  provider_name: string
  logo_path: string
}

interface StreamingProvidersProps {
  id: string
  type: "movie" | "tv"
}

export function StreamingProviders({ id, type }: StreamingProvidersProps) {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await fetch(`/api/streaming-providers?id=${id}&type=${type}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch providers: ${response.status}`)
        }

        const data = await response.json()

        if (data.results?.US?.flatrate) {
          setProviders(data.results.US.flatrate)
        } else {
          setProviders([])
        }
      } catch (error) {
        console.error("Error fetching providers:", error)
        setProviders([])
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [id, type])

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Loading streaming providers...</h2>
      </div>
    )
  }

  if (providers.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Streaming Providers</h2>
        <p className="text-center text-gray-400">No streaming information available for this title.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-center mb-6">Available on Streaming</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
        {providers.map((provider) => (
          <div key={provider.provider_id} className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2 transition-transform hover:scale-110">
              <Image
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                alt={provider.provider_name}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <p className="text-sm text-gray-300">{provider.provider_name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

