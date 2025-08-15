import { Injectable } from "@nestjs/common"
import { DatabaseService } from "../database/database.service"

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findByEmail(email: string) {
    const result = await this.databaseService.query("SELECT * FROM users WHERE email = $1", [email])
    return result.rows[0]
  }

  async findById(id: number) {
    const result = await this.databaseService.query("SELECT * FROM users WHERE id = $1", [id])
    return result.rows[0]
  }

  async create(userData: any) {
    const result = await this.databaseService.query(
      "INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userData.email, userData.password_hash, userData.first_name, userData.last_name, userData.role || "user"],
    )
    return result.rows[0]
  }

  async findAll() {
    const result = await this.databaseService.query(
      "SELECT id, email, first_name, last_name, role, created_at FROM users",
    )
    return result.rows
  }
}
