"use client"

import { ProtectedRoute } from "../../components/protected-route"
import { Navbar } from "../../components/navbar"
import { useAuth } from "../../lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { CreditCard, Zap, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back, {user?.first_name}!</h1>
            <p className="text-muted-foreground">
              {user?.role === "admin" ? "Admin Dashboard" : "Manage your credit profile and disputes"}
            </p>
          </div>

          {user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />}
        </div>
      </div>
    </ProtectedRoute>
  )
}

function UserDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">720</div>
          <p className="text-xs text-muted-foreground">+12 from last month</p>
          <Button asChild className="w-full mt-4 bg-transparent" variant="outline">
            <Link href="/profile">View Full Report</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">1 under review, 1 pending</p>
          <Button asChild className="w-full mt-4 bg-transparent" variant="outline">
            <Link href="/disputes">Manage Disputes</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Ready</div>
          <p className="text-xs text-muted-foreground">Generate dispute letters</p>
          <Button asChild className="w-full mt-4 bg-transparent" variant="outline">
            <Link href="/ai">Get AI Help</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest credit report updates and dispute progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Credit report updated</p>
                <p className="text-xs text-muted-foreground">Your credit score increased by 12 points</p>
              </div>
              <p className="text-xs text-muted-foreground">2 days ago</p>
            </div>
            <div className="flex items-center space-x-4">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Dispute under review</p>
                <p className="text-xs text-muted-foreground">Fraudulent Account XYZ dispute is being investigated</p>
              </div>
              <p className="text-xs text-muted-foreground">5 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Disputes</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-muted-foreground">Require admin review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">+2 from yesterday</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Letters Generated</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">156</div>
          <p className="text-xs text-muted-foreground">This week</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
          <CardDescription>Quick access to administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild variant="outline">
              <Link href="/admin/disputes">Review Disputes</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/reports">View Reports</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
