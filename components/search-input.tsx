"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

export function SearchInput() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      {isOpen ? (
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Titles, people, genres"
            className="bg-black/80 border border-white/20 text-white px-4 py-1 w-64 focus:outline-none"
          />
          <button type="button" onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </form>
      ) : (
        <button onClick={() => setIsOpen(true)} className="text-gray-200 hover:text-white">
          <Search className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

