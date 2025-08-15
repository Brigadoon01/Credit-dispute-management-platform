import { Injectable } from "@nestjs/common"
import { DatabaseService } from "../database/database.service"
import { MockCreditProviderService } from "./mock-credit-provider.service"

@Injectable()
export class CreditProfileService {
  constructor(
    private databaseService: DatabaseService,
    private mockCreditProvider: MockCreditProviderService,
  ) {}

  async getCreditProfile(userId: number) {
    // First check if user has a credit profile
    let result = await this.databaseService.query("SELECT * FROM credit_profiles WHERE user_id = $1", [userId])

    if (result.rows.length === 0) {
      // Create initial credit profile using mock data
      const mockData = await this.mockCreditProvider.fetchCreditData(userId)
      await this.createCreditProfile(userId, mockData)

      result = await this.databaseService.query("SELECT * FROM credit_profiles WHERE user_id = $1", [userId])
    }

    return result.rows[0]
  }

  async getCreditReportItems(userId: number) {
    // Get credit profile first
    const profile = await this.getCreditProfile(userId)

    const result = await this.databaseService.query(
      "SELECT * FROM credit_report_items WHERE credit_profile_id = $1 ORDER BY date_opened DESC",
      [profile.id],
    )

    return result.rows
  }

  async refreshCreditData(userId: number) {
    // Simulate fetching fresh data from credit provider
    const mockData = await this.mockCreditProvider.fetchCreditData(userId)

    // Update existing credit profile
    const updateResult = await this.databaseService.query(
      `UPDATE credit_profiles 
       SET credit_score = $1, report_date = $2, total_accounts = $3, 
           open_accounts = $4, total_balance = $5, payment_history_score = $6,
           credit_utilization = $7, length_of_history_months = $8, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $9 RETURNING *`,
      [
        mockData.credit_score,
        mockData.report_date,
        mockData.total_accounts,
        mockData.open_accounts,
        mockData.total_balance,
        mockData.payment_history_score,
        mockData.credit_utilization,
        mockData.length_of_history_months,
        userId,
      ],
    )

    return updateResult.rows[0]
  }

  private async createCreditProfile(userId: number, mockData: any) {
    const result = await this.databaseService.query(
      `INSERT INTO credit_profiles 
       (user_id, credit_score, report_date, total_accounts, open_accounts, 
        total_balance, payment_history_score, credit_utilization, length_of_history_months)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        userId,
        mockData.credit_score,
        mockData.report_date,
        mockData.total_accounts,
        mockData.open_accounts,
        mockData.total_balance,
        mockData.payment_history_score,
        mockData.credit_utilization,
        mockData.length_of_history_months,
      ],
    )

    const profileId = result.rows[0].id

    // Create credit report items
    for (const item of mockData.credit_items) {
      await this.databaseService.query(
        `INSERT INTO credit_report_items 
         (credit_profile_id, account_name, account_type, account_status, 
          balance, payment_status, date_opened, last_activity)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          profileId,
          item.account_name,
          item.account_type,
          item.account_status,
          item.balance,
          item.payment_status,
          item.date_opened,
          item.last_activity,
        ],
      )
    }

    return result.rows[0]
  }
}
