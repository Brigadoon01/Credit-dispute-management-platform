import { Injectable } from "@nestjs/common"

@Injectable()
export class MockCreditProviderService {
  async fetchCreditData(userId: number) {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate mock credit data based on user ID for consistency
    const baseScore = 600 + ((userId * 23) % 200) // Score between 600-800
    const accountCount = 3 + (userId % 8) // 3-10 accounts

    return {
      credit_score: Math.floor(baseScore),
      report_date: new Date().toISOString().split("T")[0],
      total_accounts: accountCount,
      open_accounts: Math.floor(accountCount * 0.7),
      total_balance: Math.floor((userId * 1000 + 5000) % 50000),
      payment_history_score: Math.floor(Math.min(100, baseScore / 8)),
      credit_utilization: Math.floor((userId * 5) % 60),
      length_of_history_months: 24 + ((userId * 3) % 120),
      credit_items: this.generateMockCreditItems(userId, accountCount),
    }
  }

  private generateMockCreditItems(userId: number, count: number) {
    const accountTypes = ["Credit Card", "Auto Loan", "Mortgage", "Student Loan", "Personal Loan", "Collection"]
    const accountNames = [
      "Chase Freedom Credit Card",
      "Wells Fargo Auto Loan",
      "Bank of America Mortgage",
      "Discover Student Loan",
      "Capital One Credit Card",
      "Citi Personal Loan",
      "Medical Collection Account",
      "American Express Card",
      "Toyota Financial Services",
      "Quicken Loans Mortgage",
    ]
    const statuses = ["Open", "Closed", "Open", "Open", "Closed"]
    const paymentStatuses = ["Current", "Current", "Current", "Late", "Paid"]

    const items = []
    for (let i = 0; i < count; i++) {
      const accountType = accountTypes[i % accountTypes.length]
      const isCollection = accountType === "Collection"

      items.push({
        account_name: isCollection ? `${accountNames[6]} #${userId}${i}` : accountNames[i % accountNames.length],
        account_type: accountType,
        account_status: isCollection ? "Open" : statuses[i % statuses.length],
        balance: Math.floor(isCollection ? (userId * 100 + i * 50) % 2000 : (userId * 500 + i * 1000) % 25000),
        payment_status: isCollection ? "Collection" : paymentStatuses[i % paymentStatuses.length],
        date_opened: this.generateRandomDate(2018, 2023),
        last_activity: this.generateRandomDate(2023, 2024),
      })
    }

    // Add a potentially fraudulent account for dispute testing
    if (userId === 1) {
      items.push({
        account_name: "Fraudulent Account XYZ",
        account_type: "Credit Card",
        account_status: "Open",
        balance: 500,
        payment_status: "Late",
        date_opened: "2023-11-01",
        last_activity: "2023-12-20",
      })
    }

    return items
  }

  private generateRandomDate(startYear: number, endYear: number): string {
    const start = new Date(startYear, 0, 1)
    const end = new Date(endYear, 11, 31)
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return date.toISOString().split("T")[0]
  }
}
