"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiService } from "./api-service"

interface User {
  id: number
  email: string
  role: "user" | "admin"
  first_name: string
  last_name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  role?: "user" | "admin"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("access_token")
    if (token) {
      // Verify token is still valid by making a test request
      apiService
        .get("/auth/profile")
        .then((response) => {
          setUser(response.data)
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.post("/auth/login", { email, password })
      const { access_token, refresh_token, user: userData } = response.data

      localStorage.setItem("access_token", access_token)
      localStorage.setItem("refresh_token", refresh_token)
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await apiService.post("/auth/register", userData)
      const { access_token, refresh_token, user: newUser } = response.data

      localStorage.setItem("access_token", access_token)
      localStorage.setItem("refresh_token", refresh_token)
      setUser(newUser)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
    // Call backend logout endpoint
    apiService.post("/auth/logout").catch(() => {
      // Ignore errors on logout
    })
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
