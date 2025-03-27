"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchInput } from "./search-input-fixed"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

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
        </div>

        <div className="flex-1"></div>

        <div className="flex items-center space-x-4 text-sm font-light">
          <SearchInput />
          <Bell className="h-5 w-5 cursor-pointer" />
          <div className="flex items-center space-x-2 cursor-pointer">
            <Image src="/placeholder.svg?height=32&width=32" alt="Profile" width={32} height={32} className="rounded" />
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  )
}

