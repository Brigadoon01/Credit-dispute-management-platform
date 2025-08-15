import { Injectable } from "@nestjs/common"
import { DatabaseService } from "../database/database.service"

@Injectable()
export class DisputesService {
  constructor(private databaseService: DatabaseService) {}

  async createDispute(disputeData: any) {
    const result = await this.databaseService.query(
      `INSERT INTO disputes (user_id, credit_report_item_id, dispute_reason, status)
       VALUES ($1, $2, $3, 'pending') RETURNING *`,
      [disputeData.user_id, disputeData.credit_report_item_id, disputeData.dispute_reason],
    )

    // Get the full dispute with related data
    return this.getDisputeById(result.rows[0].id)
  }

  async getUserDisputes(userId: number, status?: string) {
    let query = `
      SELECT d.*, cri.account_name, cri.account_type, cri.balance, u.first_name, u.last_name
      FROM disputes d
      JOIN credit_report_items cri ON d.credit_report_item_id = cri.id
      JOIN users u ON d.user_id = u.id
      WHERE d.user_id = $1
    `
    const params: any[] = [userId]

    if (status) {
      query += " AND d.status = $2"
      params.push(status)
    }

    query += " ORDER BY d.created_at DESC"

    const result = await this.databaseService.query(query, params)
    return result.rows
  }

  async getAllDisputes(status?: string) {
    let query = `
      SELECT d.*, cri.account_name, cri.account_type, cri.balance, u.first_name, u.last_name, u.email
      FROM disputes d
      JOIN credit_report_items cri ON d.credit_report_item_id = cri.id
      JOIN users u ON d.user_id = u.id
    `
    const params: any[] = []

    if (status) {
      query += " WHERE d.status = $1"
      params.push(status)
    }

    query += " ORDER BY d.created_at DESC"

    const result = await this.databaseService.query(query, params)
    return result.rows
  }

  async getDisputeById(id: number) {
    const result = await this.databaseService.query(
      `SELECT d.*, cri.account_name, cri.account_type, cri.balance, cri.payment_status,
              u.first_name, u.last_name, u.email
       FROM disputes d
       JOIN credit_report_items cri ON d.credit_report_item_id = cri.id
       JOIN users u ON d.user_id = u.id
       WHERE d.id = $1`,
      [id],
    )

    if (result.rows.length === 0) {
      throw new Error("Dispute not found")
    }

    return result.rows[0]
  }

  async updateDisputeStatus(id: number, updateData: any) {
    const setClause = []
    const params = []
    let paramIndex = 1

    if (updateData.status) {
      setClause.push(`status = $${paramIndex}`)
      params.push(updateData.status)
      paramIndex++
    }

    if (updateData.admin_notes) {
      setClause.push(`admin_notes = $${paramIndex}`)
      params.push(updateData.admin_notes)
      paramIndex++
    }

    if (updateData.resolution_notes) {
      setClause.push(`resolution_notes = $${paramIndex}`)
      params.push(updateData.resolution_notes)
      paramIndex++
    }

    if (updateData.status === "resolved") {
      setClause.push(`resolved_at = CURRENT_TIMESTAMP`)
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`)
    params.push(id)

    const result = await this.databaseService.query(
      `UPDATE disputes SET ${setClause.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      params,
    )

    return this.getDisputeById(result.rows[0].id)
  }

  async getDisputeStats() {
    const totalResult = await this.databaseService.query("SELECT COUNT(*) as total FROM disputes")
    const statusResult = await this.databaseService.query(`
      SELECT status, COUNT(*) as count 
      FROM disputes 
      GROUP BY status
    `)
    const recentResult = await this.databaseService.query(`
      SELECT COUNT(*) as recent 
      FROM disputes 
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `)

    const statusCounts = statusResult.rows.reduce(
      (acc, row) => {
        acc[row.status] = Number.parseInt(row.count)
        return acc
      },
      { pending: 0, submitted: 0, under_review: 0, resolved: 0, rejected: 0 },
    )

    return {
      total: Number.parseInt(totalResult.rows[0].total),
      recent: Number.parseInt(recentResult.rows[0].recent),
      by_status: statusCounts,
    }
  }
}
