import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "../lib/auth-context"
import { Toaster } from "../components/ui/toaster"

// Initialize the Inter font
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Credit Dispute Management Platform",
  description: "Manage your credit profile and disputes",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
