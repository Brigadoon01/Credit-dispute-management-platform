"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "../../../../components/protected-route"
import { Navbar } from "../../../../components/navbar"
import { apiService } from "../../../../lib/api-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Textarea } from "../../../../components/ui/textarea"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Badge } from "../../../../components/ui/badge"
import { Alert, AlertDescription } from "../../../../components/ui/alert"
import { ArrowLeft, User, CreditCard, Calendar } from "lucide-react"
import Link from "next/link"
import { useToast } from "../../../../hooks/use-toast"

interface DisputeDetail {
  id: number
  dispute_reason: string
  status: string
  admin_notes?: string
  resolution_notes?: string
  created_at: string
  updated_at: string
  resolved_at?: string
  account_name: string
  account_type: string
  balance: number
  payment_status: string
  first_name: string
  last_name: string
  email: string
  user_id: number
}

export default function AdminDisputeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const disputeId = params.id as string

  const [dispute, setDispute] = useState<DisputeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [resolutionNotes, setResolutionNotes] = useState("")

  useEffect(() => {
    fetchDispute()
  }, [disputeId])

  const fetchDispute = async () => {
    try {
      const response = await apiService.get(`/disputes/${disputeId}`)
      const disputeData = response.data
      setDispute(disputeData)
      setNewStatus(disputeData.status)
      setAdminNotes(disputeData.admin_notes || "")
      setResolutionNotes(disputeData.resolution_notes || "")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dispute details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!dispute) return

    setUpdating(true)
    try {
      await apiService.put(`/disputes/${dispute.id}/status`, {
        status: newStatus,
        admin_notes: adminNotes.trim() || undefined,
        resolution_notes: resolutionNotes.trim() || undefined,
      })

      toast({
        title: "Success",
        description: "Dispute status updated successfully",
      })

      // Refresh dispute data
      await fetchDispute()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update dispute",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
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

  if (!dispute) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <AlertDescription>Dispute not found.</AlertDescription>
            </Alert>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/disputes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Disputes
              </Link>
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dispute Review</h1>
                <p className="text-muted-foreground">Review and manage dispute #{dispute.id}</p>
              </div>
              <Badge variant={getStatusColor(dispute.status) as any} className="text-sm">
                {dispute.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm">
                    {dispute.first_name} {dispute.last_name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{dispute.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">User ID</Label>
                  <p className="text-sm">#{dispute.user_id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Account Name</Label>
                  <p className="text-sm">{dispute.account_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Account Type</Label>
                  <p className="text-sm">{dispute.account_type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Balance</Label>
                  <p className="text-sm">${dispute.balance.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Status</Label>
                  <p className="text-sm">{dispute.payment_status}</p>
                </div>
              </CardContent>
            </Card>

            {/* Dispute Details */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Dispute Details</CardTitle>
                <CardDescription>User's dispute reason and timeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Dispute Reason</Label>
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <p className="text-sm">{dispute.dispute_reason}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-xs font-medium">Created</Label>
                      <p className="text-sm">{new Date(dispute.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-xs font-medium">Last Updated</Label>
                      <p className="text-sm">{new Date(dispute.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {dispute.resolved_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-xs font-medium">Resolved</Label>
                        <p className="text-sm">{new Date(dispute.resolved_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Admin Actions */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
                <CardDescription>Update dispute status and add notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-notes">Admin Notes</Label>
                  <Textarea
                    id="admin-notes"
                    placeholder="Add internal notes about this dispute..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resolution-notes">Resolution Notes</Label>
                  <Textarea
                    id="resolution-notes"
                    placeholder="Add resolution details that will be visible to the user..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleUpdateStatus} disabled={updating}>
                    {updating ? "Updating..." : "Update Dispute"}
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/disputes">Cancel</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
