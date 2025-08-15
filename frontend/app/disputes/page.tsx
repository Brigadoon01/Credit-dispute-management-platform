"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "../../components/protected-route"
import { Navbar } from "../../components/navbar"
import { useAuth } from "../../lib/auth-context"
import { apiService } from "../../lib/api-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Plus, Clock, CheckCircle, XCircle, AlertTriangle, Eye } from "lucide-react"
import Link from "next/link"
import { useToast } from "../../hooks/use-toast"

interface Dispute {
  id: number
  dispute_reason: string
  status: "pending" | "submitted" | "under_review" | "resolved" | "rejected"
  admin_notes?: string
  resolution_notes?: string
  created_at: string
  updated_at: string
  resolved_at?: string
  account_name: string
  account_type: string
  balance: number
  first_name: string
  last_name: string
  email?: string
}

export default function DisputesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchDisputes()
  }, [])

  const fetchDisputes = async () => {
    try {
      const response = await apiService.get("/disputes/history")
      setDisputes(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load disputes",
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
        return <Eye className="h-4 w-4 text-purple-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "default"
      case "submitted":
        return "secondary"
      case "under_review":
        return "default"
      case "resolved":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const filterDisputes = (status: string) => {
    if (status === "all") return disputes
    return disputes.filter((dispute) => dispute.status === status)
  }

  const getStatusCounts = () => {
    return {
      all: disputes.length,
      pending: disputes.filter((d) => d.status === "pending").length,
      under_review: disputes.filter((d) => d.status === "under_review").length,
      resolved: disputes.filter((d) => d.status === "resolved").length,
      rejected: disputes.filter((d) => d.status === "rejected").length,
    }
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

  const counts = getStatusCounts()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">{user?.role === "admin" ? "Dispute Management" : "My Disputes"}</h1>
              <p className="text-muted-foreground">
                {user?.role === "admin"
                  ? "Review and manage all user disputes"
                  : "Track your credit report dispute progress"}
              </p>
            </div>
            {user?.role !== "admin" && (
              <Button asChild>
                <Link href="/disputes/create">
                  <Plus className="h-4 w-4 mr-2" />
                  New Dispute
                </Link>
              </Button>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
              <TabsTrigger value="under_review">Under Review ({counts.under_review})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({counts.resolved})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({counts.rejected})</TabsTrigger>
            </TabsList>

            {["all", "pending", "under_review", "resolved", "rejected"].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4">
                {filterDisputes(status).length === 0 ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {status === "all"
                        ? "No disputes found. Create your first dispute to get started."
                        : `No ${status.replace("_", " ")} disputes found.`}
                    </AlertDescription>
                  </Alert>
                ) : (
                  filterDisputes(status).map((dispute) => (
                    <Card key={dispute.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(dispute.status)}
                            <div>
                              <CardTitle className="text-lg">{dispute.account_name}</CardTitle>
                              <CardDescription>
                                {dispute.account_type} • ${dispute.balance.toLocaleString()}
                                {user?.role === "admin" && (
                                  <span className="ml-2">
                                    • {dispute.first_name} {dispute.last_name} ({dispute.email})
                                  </span>
                                )}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={getStatusColor(dispute.status) as any}>
                            {dispute.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Dispute Reason:</h4>
                            <p className="text-sm text-muted-foreground">{dispute.dispute_reason}</p>
                          </div>

                          {dispute.admin_notes && (
                            <div>
                              <h4 className="font-medium mb-2">Admin Notes:</h4>
                              <p className="text-sm text-muted-foreground">{dispute.admin_notes}</p>
                            </div>
                          )}

                          {dispute.resolution_notes && (
                            <div>
                              <h4 className="font-medium mb-2">Resolution:</h4>
                              <p className="text-sm text-muted-foreground">{dispute.resolution_notes}</p>
                            </div>
                          )}

                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Created: {new Date(dispute.created_at).toLocaleDateString()}</span>
                            <span>Updated: {new Date(dispute.updated_at).toLocaleDateString()}</span>
                            {dispute.resolved_at && (
                              <span>Resolved: {new Date(dispute.resolved_at).toLocaleDateString()}</span>
                            )}
                          </div>

                          {user?.role === "admin" && dispute.status !== "resolved" && dispute.status !== "rejected" && (
                            <div className="flex gap-2 pt-4 border-t">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  window.location.href = `/admin/disputes/${dispute.id}`
                                }}
                              >
                                Review
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
