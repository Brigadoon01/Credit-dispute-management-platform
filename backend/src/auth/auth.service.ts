import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UsersService } from "../users/users.service"
import { DatabaseService } from "../database/database.service"
import type { RegisterDto } from "./dto/register.dto"
import * as bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const { password_hash, ...result } = user
      return result
    }
    return null
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email)
    if (existingUser) {
      throw new ConflictException("User with this email already exists")
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10)
    const user = await this.usersService.create({
      ...registerDto,
      password_hash: hashedPassword,
    })

    const { password_hash, ...result } = user
    return this.generateTokens(result)
  }

  async login(user: any) {
    return this.generateTokens(user)
  }

  async generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role }

    const accessToken = this.jwtService.sign(payload)
    const refreshToken = uuidv4()

    // Store refresh token in database
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    await this.databaseService.query("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)", [
      user.id,
      refreshToken,
      expiresAt,
    ])

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    }
  }

  async refreshToken(refreshToken: string) {
    const result = await this.databaseService.query(
      "SELECT rt.*, u.* FROM refresh_tokens rt JOIN users u ON rt.user_id = u.id WHERE rt.token = $1 AND rt.expires_at > NOW()",
      [refreshToken],
    )

    if (result.rows.length === 0) {
      throw new UnauthorizedException("Invalid refresh token")
    }

    const user = result.rows[0]

    // Delete old refresh token
    await this.databaseService.query("DELETE FROM refresh_tokens WHERE token = $1", [refreshToken])

    // Generate new tokens
    return this.generateTokens(user)
  }

  async regenerateToken(userId: number) {
    const user = await this.usersService.findById(userId)
    if (!user) {
      throw new UnauthorizedException("User not found")
    }

    // Delete all existing refresh tokens for this user
    await this.databaseService.query("DELETE FROM refresh_tokens WHERE user_id = $1", [userId])

    const { password_hash, ...userResult } = user
    return this.generateTokens(userResult)
  }

  async logout(userId: number) {
    await this.databaseService.query("DELETE FROM refresh_tokens WHERE user_id = $1", [userId])
    return { message: "Logged out successfully" }
  }
}
