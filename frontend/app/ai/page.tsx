"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "../../components/protected-route"
import { Navbar } from "../../components/navbar"
import { apiService } from "../../lib/api-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Zap, Copy, Download, Sparkles, FileText, CheckCircle } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

export default function AiAssistantPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState("")
  const [generatedWithAI, setGeneratedWithAI] = useState(false)

  // Form state
  const [accountName, setAccountName] = useState("")
  const [accountType, setAccountType] = useState("")
  const [disputeReason, setDisputeReason] = useState("")

  const handleGenerateLetter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accountName.trim() || !accountType.trim() || !disputeReason.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await apiService.post("/ai/generate-letter", {
        account_name: accountName.trim(),
        account_type: accountType.trim(),
        dispute_reason: disputeReason.trim(),
      })

      setGeneratedLetter(response.data.letter_content)
      setGeneratedWithAI(response.data.generated_with_ai)

      toast({
        title: "Success",
        description: `Dispute letter generated ${response.data.generated_with_ai ? "with AI" : "successfully"}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to generate letter",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLetter = async () => {
    try {
      await navigator.clipboard.writeText(generatedLetter)
      toast({
        title: "Copied",
        description: "Letter copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy letter",
        variant: "destructive",
      })
    }
  }

  const handleDownloadLetter = () => {
    const blob = new Blob([generatedLetter], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `dispute-letter-${accountName.replace(/\s+/g, "-").toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "Letter downloaded successfully",
    })
  }

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
  ]

  const commonAccountTypes = [
    "Credit Card",
    "Auto Loan",
    "Mortgage",
    "Student Loan",
    "Personal Loan",
    "Collection Account",
    "Medical Debt",
    "Store Credit Card",
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">AI Dispute Assistant</h1>
                <p className="text-muted-foreground">Generate professional dispute letters with AI assistance</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate Letter</TabsTrigger>
              <TabsTrigger value="tips">Tips & Guidelines</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Input Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Dispute Information
                    </CardTitle>
                    <CardDescription>
                      Provide details about the account you want to dispute. The AI will generate a professional letter
                      for you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleGenerateLetter} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="account-name">Account Name</Label>
                        <Input
                          id="account-name"
                          placeholder="e.g., Chase Freedom Credit Card"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="account-type">Account Type</Label>
                        <div className="space-y-2">
                          <Input
                            id="account-type"
                            placeholder="e.g., Credit Card"
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value)}
                            required
                          />
                          <div className="flex flex-wrap gap-1">
                            {commonAccountTypes.map((type) => (
                              <Button
                                key={type}
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs bg-transparent"
                                onClick={() => setAccountType(type)}
                              >
                                {type}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dispute-reason">Dispute Reason</Label>
                        <div className="space-y-2">
                          <Textarea
                            id="dispute-reason"
                            placeholder="Explain why you're disputing this account..."
                            value={disputeReason}
                            onChange={(e) => setDisputeReason(e.target.value)}
                            rows={4}
                            required
                          />
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground mb-2">Quick reasons:</p>
                            {commonDisputeReasons.map((reason) => (
                              <Button
                                key={reason}
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mr-2 mb-1 h-7 text-xs bg-transparent"
                                onClick={() => setDisputeReason(reason)}
                              >
                                {reason}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full">
                        <Sparkles className="h-4 w-4 mr-2" />
                        {loading ? "Generating Letter..." : "Generate Dispute Letter"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Generated Letter */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Generated Letter
                        </CardTitle>
                        <CardDescription>
                          {generatedLetter
                            ? `Professional dispute letter ${generatedWithAI ? "powered by AI" : "generated"}`
                            : "Your generated letter will appear here"}
                        </CardDescription>
                      </div>
                      {generatedWithAI && (
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Zap className="h-3 w-3" />
                          AI Generated
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {generatedLetter ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <Textarea
                            value={generatedLetter}
                            onChange={(e) => setGeneratedLetter(e.target.value)}
                            rows={20}
                            className="font-mono text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleCopyLetter} variant="outline" size="sm">
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button onClick={handleDownloadLetter} variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            Review and customize the letter before sending. Replace placeholders like [Your Name] with
                            your actual information.
                          </AlertDescription>
                        </Alert>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-muted-foreground">
                        <div className="text-center">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Fill out the form and click "Generate" to create your dispute letter</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tips" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Writing Effective Disputes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Be Specific</h4>
                      <p className="text-sm text-muted-foreground">
                        Clearly identify the account and explain exactly what is incorrect. Include account numbers,
                        dates, and amounts when possible.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Stay Professional</h4>
                      <p className="text-sm text-muted-foreground">
                        Use formal business language. Avoid emotional language or accusations. Stick to facts.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Include Documentation</h4>
                      <p className="text-sm text-muted-foreground">
                        Attach copies (never originals) of supporting documents like payment records, identity theft
                        reports, or account statements.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Legal Rights & Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Fair Credit Reporting Act (FCRA)</h4>
                      <p className="text-sm text-muted-foreground">
                        You have the right to dispute inaccurate information on your credit report. Credit bureaus must
                        investigate within 30 days.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Response Timeline</h4>
                      <p className="text-sm text-muted-foreground">
                        Credit bureaus have 30 days to investigate your dispute (45 days if you provide additional
                        information during the investigation).
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Follow Up</h4>
                      <p className="text-sm text-muted-foreground">
                        If items aren't removed, you can add a consumer statement to your credit report explaining your
                        side of the story.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Common Dispute Reasons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium mb-2">Account Errors</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Account doesn't belong to you</li>
                          <li>• Incorrect balance or payment history</li>
                          <li>• Account status is wrong</li>
                          <li>• Duplicate accounts</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Personal Information</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Wrong name, address, or SSN</li>
                          <li>• Accounts from identity theft</li>
                          <li>• Mixed credit files</li>
                          <li>• Outdated information</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
