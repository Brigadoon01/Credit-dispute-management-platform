"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "../../components/protected-route"
import { Navbar } from "../../components/navbar"
import { apiService } from "../../lib/api-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Alert, AlertDescription } from "../../components/ui/alert"
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "../../hooks/use-toast"

interface DisputeStats {
  total: number
  recent: number
  by_status: {
    pending: number
    submitted: number
    under_review: number
    resolved: number
    rejected: number
  }
}

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
  created_at: string
}

export default function AdminDashboardPage() {
  const { toast } = useToast()
  const [disputeStats, setDisputeStats] = useState<DisputeStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const [statsResponse, usersResponse] = await Promise.all([
        apiService.get("/disputes/stats/overview"),
        apiService.get("/users"),
      ])

      setDisputeStats(statsResponse.data)
      setUsers(usersResponse.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "submitted":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      case "under_review":
        return <FileText className="h-4 w-4 text-purple-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage users, disputes, and system overview</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="disputes">Dispute Management</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Overview */}
              {disputeStats && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{disputeStats.total}</div>
                      <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Recent Disputes</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{disputeStats.recent}</div>
                      <p className="text-xs text-muted-foreground">Last 7 days</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {disputeStats.by_status.pending + disputeStats.by_status.under_review}
                      </div>
                      <p className="text-xs text-muted-foreground">Require attention</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{users.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {users.filter((u) => u.role === "admin").length} admins
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Status Breakdown */}
              {disputeStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Dispute Status Breakdown
                    </CardTitle>
                    <CardDescription>Current status distribution of all disputes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-5">
                      {Object.entries(disputeStats.by_status).map(([status, count]) => (
                        <div key={status} className="flex items-center space-x-3 p-3 border rounded-lg">
                          {getStatusIcon(status)}
                          <div>
                            <div className="font-medium">{count}</div>
                            <div className="text-sm text-muted-foreground capitalize">{status.replace("_", " ")}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                      <Link href="/disputes?status=pending">
                        <div className="text-center">
                          <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                          <div className="font-medium">Review Pending</div>
                          <div className="text-sm text-muted-foreground">
                            {disputeStats?.by_status.pending || 0} disputes
                          </div>
                        </div>
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                      <Link href="/disputes?status=under_review">
                        <div className="text-center">
                          <FileText className="h-6 w-6 mx-auto mb-2" />
                          <div className="font-medium">Under Review</div>
                          <div className="text-sm text-muted-foreground">
                            {disputeStats?.by_status.under_review || 0} disputes
                          </div>
                        </div>
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                      <Link href="/admin/reports">
                        <div className="text-center">
                          <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                          <div className="font-medium">View Reports</div>
                          <div className="text-sm text-muted-foreground">Analytics & insights</div>
                        </div>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="disputes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dispute Management</CardTitle>
                  <CardDescription>Review and manage all user disputes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Button asChild>
                        <Link href="/disputes">View All Disputes</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/disputes?status=pending">Pending Disputes</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/disputes?status=under_review">Under Review</Link>
                      </Button>
                    </div>

                    {disputeStats && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          You have {disputeStats.by_status.pending + disputeStats.by_status.under_review} disputes that
                          require your attention.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage system users and their roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.length === 0 ? (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>No users found.</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-3">
                        {users.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-primary/10 rounded-full">
                                <Users className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">
                                  {user.first_name} {user.last_name}
                                </h4>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                {user.role.toUpperCase()}
                              </Badge>
                              <div className="text-sm text-muted-foreground">
                                Joined {new Date(user.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
