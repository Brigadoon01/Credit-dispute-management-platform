"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../lib/auth-context"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { User, LogOut, CreditCard } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <CreditCard className="h-6 w-6" />
            <span className="font-bold">Credit Dispute Platform</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary">
              Credit Profile
            </Link>
            <Link href="/disputes" className="text-sm font-medium transition-colors hover:text-primary">
              Disputes
            </Link>
            <Link href="/ai" className="text-sm font-medium transition-colors hover:text-primary">
              AI Assistant
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" className="text-sm font-medium transition-colors hover:text-primary">
                Admin
              </Link>
            )}
          </nav>

            <div className="relative" ref={dropdownRef}>
              <Button 
                variant="ghost" 
                className="relative h-8 w-8 rounded-full hover:bg-accent"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <User className="h-4 w-4" />
              </Button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-popover p-2 shadow-md z-[100]">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <div className="h-px bg-border my-2"></div>
                  <button
                    className="flex w-full items-center px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                    onClick={() => {
                      console.log('Logout clicked');
                      logout();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
        </div>
      </div>
    </nav>
  )
}
