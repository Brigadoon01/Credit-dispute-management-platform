"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "../../components/protected-route"
import { Navbar } from "../../components/navbar"
import { useAuth } from "../../lib/auth-context"
import { apiService } from "../../lib/api-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Alert, AlertDescription } from "../../components/ui/alert"
import {
  TrendingUp,
  CreditCard,
  DollarSign,
  Calendar,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface CreditProfile {
  id: number
  credit_score: number
  report_date: string
  total_accounts: number
  open_accounts: number
  total_balance: number
  payment_history_score: number
  credit_utilization: number
  length_of_history_months: number
}

interface CreditReportItem {
  id: number
  account_name: string
  account_type: string
  account_status: string
  balance: number
  payment_status: string
  date_opened: string
  last_activity: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<CreditProfile | null>(null)
  const [reportItems, setReportItems] = useState<CreditReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (user) {
      fetchCreditData()
    }
  }, [user])

  const fetchCreditData = async () => {
    try {
      const [profileResponse, itemsResponse] = await Promise.all([
        apiService.get(`/credit-profile/${user?.id}`),
        apiService.get(`/credit-profile/${user?.id}/items`),
      ])

      setProfile(profileResponse.data)
      setReportItems(itemsResponse.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load credit profile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const response = await apiService.get(`/credit-profile/${user?.id}/refresh`)
      setProfile(response.data)
      await fetchCreditData() // Refresh all data
      toast({
        title: "Success",
        description: "Credit data refreshed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh credit data",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600"
    if (score >= 700) return "text-blue-600"
    if (score >= 650) return "text-yellow-600"
    return "text-red-600"
  }

  const getCreditScoreLabel = (score: number) => {
    if (score >= 750) return "Excellent"
    if (score >= 700) return "Good"
    if (score >= 650) return "Fair"
    return "Poor"
  }

  const getAccountStatusIcon = (status: string, paymentStatus: string) => {
    if (paymentStatus === "Collection" || paymentStatus === "Late") {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
    if (status === "Closed" && paymentStatus === "Paid") {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    if (status === "Open" && paymentStatus === "Current") {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return <XCircle className="h-4 w-4 text-yellow-500" />
  }

  if (loading) {
    return (
      <ProtectedRoute>
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
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Credit Profile</h1>
              <p className="text-muted-foreground">
                Last updated: {profile ? new Date(profile.report_date).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <Button onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>

          {profile && (
            <>
              {/* Credit Score Overview */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Credit Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`text-4xl font-bold ${getCreditScoreColor(profile.credit_score)}`}>
                        {profile.credit_score}
                      </div>
                      <Badge variant="secondary">{getCreditScoreLabel(profile.credit_score)}</Badge>
                    </div>
                    <Progress value={(profile.credit_score / 850) * 100} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Range: 300 - 850 • Payment History: {profile.payment_history_score}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Credit Utilization</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{profile.credit_utilization}%</div>
                    <Progress value={profile.credit_utilization} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {profile.credit_utilization < 30 ? "Good" : "High utilization"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Credit History</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.floor(profile.length_of_history_months / 12)}y {profile.length_of_history_months % 12}m
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {profile.length_of_history_months > 60 ? "Excellent length" : "Building history"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Account Summary */}
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{profile.total_accounts}</div>
                    <p className="text-xs text-muted-foreground">
                      {profile.open_accounts} open, {profile.total_accounts - profile.open_accounts} closed
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${profile.total_balance.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Across all accounts</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Accounts</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{profile.open_accounts}</div>
                    <p className="text-xs text-muted-foreground">Currently active</p>
                  </CardContent>
                </Card>
              </div>

              {/* Credit Report Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Credit Report Items</CardTitle>
                  <CardDescription>
                    Review your credit accounts. Click on any item to dispute if you find inaccuracies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => {
                          // Navigate to dispute creation with this item
                          window.location.href = `/disputes/create?itemId=${item.id}`
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          {getAccountStatusIcon(item.account_status, item.payment_status)}
                          <div>
                            <h4 className="font-medium">{item.account_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.account_type} • Opened {new Date(item.date_opened).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${item.balance.toLocaleString()}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant={item.account_status === "Open" ? "default" : "secondary"}>
                              {item.account_status}
                            </Badge>
                            <Badge
                              variant={
                                item.payment_status === "Current" || item.payment_status === "Paid"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {item.payment_status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {reportItems.length === 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>No credit report items found. Try refreshing your data.</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
