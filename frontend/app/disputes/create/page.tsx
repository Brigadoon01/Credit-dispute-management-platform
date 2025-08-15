"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProtectedRoute } from "../../../components/protected-route"
import { Navbar } from "../../../components/navbar"
import { useAuth } from "../../../lib/auth-context"
import { apiService } from "../../../lib/api-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Textarea } from "../../../components/ui/textarea"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useToast } from "../../../hooks/use-toast"

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

export default function CreateDisputePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedItemId = searchParams.get("itemId")

  const [creditItems, setCreditItems] = useState<CreditReportItem[]>([])
  const [selectedItemId, setSelectedItemId] = useState<string>(preselectedItemId || "")
  const [disputeReason, setDisputeReason] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      fetchCreditItems()
    }
  }, [user])

  const fetchCreditItems = async () => {
    try {
      const response = await apiService.get(`/credit-profile/${user?.id}/items`)
      setCreditItems(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load credit report items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItemId || !disputeReason.trim()) {
      toast({
        title: "Error",
        description: "Please select an item and provide a dispute reason",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      await apiService.post("/disputes/create", {
        credit_report_item_id: Number.parseInt(selectedItemId),
        dispute_reason: disputeReason.trim(),
      })

      toast({
        title: "Success",
        description: "Dispute created successfully",
      })

      router.push("/disputes")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create dispute",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const selectedItem = creditItems.find((item) => item.id === Number.parseInt(selectedItemId))

  const commonDisputeReasons = [
    "This account does not belong to me (identity theft)",
    "This account was paid in full but shows a balance",
    "The payment history is incorrect",
    "This account was closed but shows as open",
    "The balance amount is incorrect",
    "This is a duplicate account",
    "The account was included in bankruptcy",
    "I never opened this account",
    "The dates are incorrect",
    "Other (please specify below)",
  ]

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
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/disputes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Disputes
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Create New Dispute</h1>
            <p className="text-muted-foreground">
              Dispute an inaccurate item on your credit report. Provide detailed information to support your claim.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dispute Information</CardTitle>
              <CardDescription>Select the credit report item you want to dispute and explain why.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="credit-item">Credit Report Item</Label>
                  <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a credit report item to dispute" />
                    </SelectTrigger>
                    <SelectContent>
                      {creditItems.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.account_name} - {item.account_type} (${item.balance.toLocaleString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedItem && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Selected Item:</strong> {selectedItem.account_name}
                      <br />
                      <strong>Type:</strong> {selectedItem.account_type} • <strong>Status:</strong>{" "}
                      {selectedItem.account_status} • <strong>Balance:</strong> ${selectedItem.balance.toLocaleString()}
                      <br />
                      <strong>Payment Status:</strong> {selectedItem.payment_status} • <strong>Opened:</strong>{" "}
                      {new Date(selectedItem.date_opened).toLocaleDateString()}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="dispute-reason">Dispute Reason</Label>
                  <div className="space-y-3">
                    <div className="grid gap-2">
                      {commonDisputeReasons.map((reason, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="outline"
                          className="justify-start h-auto p-3 text-left bg-transparent"
                          onClick={() => setDisputeReason(reason)}
                        >
                          {reason}
                        </Button>
                      ))}
                    </div>
                    <Textarea
                      id="dispute-reason"
                      placeholder="Provide detailed information about why you're disputing this item..."
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      rows={6}
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Be specific and provide as much detail as possible. Include dates, amounts, and any supporting
                    information.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={submitting || !selectedItemId || !disputeReason.trim()}>
                    {submitting ? "Creating Dispute..." : "Create Dispute"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/disputes">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
