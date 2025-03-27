"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Bell, ChevronDown, SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/redux/hooks"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { selectedProfile } = useAppSelector((state) => state.user)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  const handleLogout = () => {
    // Implement logout logic
    router.push("/login")
  }

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-colors duration-300 ease-in-out",
        isScrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent",
      )}
    >
      <div className="flex items-center space-x-2 md:space-x-10 px-4 md:px-8 py-4">
        <Link href="/" className="h-5 md:h-7">
          <Image
            src="/lotsoflex-logo.svg"
            alt="Lotsoflex"
            width={120}
            height={32}
            className="cursor-pointer object-contain"
          />
        </Link>

        <div className="hidden md:flex space-x-4">
          <Link href="/" className="text-sm font-light text-white hover:text-gray-300">
            Home
          </Link>
          <Link href="/tv-shows" className="text-sm font-light text-white hover:text-gray-300">
            TV Shows
          </Link>
          <Link href="/movies" className="text-sm font-light text-white hover:text-gray-300">
            Movies
          </Link>
          <Link href="/new-popular" className="text-sm font-light text-white hover:text-gray-300">
            New & Popular
          </Link>
          <Link href="/my-list" className="text-sm font-light text-white hover:text-gray-300">
            My List
          </Link>
          <Link href="/browse-by-language" className="text-sm font-light text-white hover:text-gray-300">
            Browse by Language
          </Link>
        </div>

        <div className="flex-1"></div>

        <div className="flex items-center space-x-4 text-sm font-light">
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titles, people, genres"
                  className="bg-black/80 border border-white/20 text-white px-4 py-1 w-64 focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="p-2 text-gray-400 hover:text-white cursor-pointer">
                  <SearchIcon className="h-5 w-5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-200 hover:text-white cursor-pointer"
                aria-label="Search"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          <Link href="/notifications" className="text-gray-200 hover:text-white">
            <Bell className="h-5 w-5 cursor-pointer" />
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Image
                    src={selectedProfile?.avatar || "/placeholder.svg?height=32&width=32"}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded"
                  />
                  <ChevronDown className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black/90 border-gray-800">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user?.name && (
                  <DropdownMenuItem className="cursor-pointer">
                    <span>{user.name}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/account" className="w-full">
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/profiles" className="w-full">
                    Manage Profiles
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  Sign out of Lotsoflex
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

