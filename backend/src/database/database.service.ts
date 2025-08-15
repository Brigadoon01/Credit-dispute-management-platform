import { Injectable, type OnModuleInit } from "@nestjs/common"
import { Pool } from "pg"

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: Pool

  async onModuleInit() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  }

  async query(text: string, params?: any[]) {
    const client = await this.pool.connect()
    try {
      const result = await client.query(text, params)
      return result
    } finally {
      client.release()
    }
  }

  async getClient() {
    return this.pool.connect()
  }
}
