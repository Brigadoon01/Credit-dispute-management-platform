import { Controller, Get, Request, UseGuards, Param, UnauthorizedException } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { CreditProfileService } from "./credit-profile.service"
import { UsersService } from "../users/users.service"

@Controller("credit-profile")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreditProfileController {
  constructor(
    private creditProfileService: CreditProfileService,
    private usersService: UsersService,
  ) {}

  @Get(":userId")
  async getCreditProfile(@Param("userId") userId: string, @Request() req) {
    // Users can only access their own profile, admins can access any
    if (req.user?.role !== "admin" && Number.parseInt(userId) !== req.user?.id) {
      throw new UnauthorizedException("Unauthorized access to credit profile")
    }

    return this.creditProfileService.getCreditProfile(Number.parseInt(userId))
  }

  @Get(":userId/items")
  async getCreditReportItems(@Param("userId") userId: string, @Request() req) {
    // Users can only access their own items, admins can access any
    if (req.user?.role !== "admin" && Number.parseInt(userId) !== req.user?.id) {
      throw new UnauthorizedException("Unauthorized access to credit profile")
    }

    return this.creditProfileService.getCreditReportItems(Number.parseInt(userId))
  }

  @Get(":userId/refresh")
  async refreshCreditData(@Param("userId") userId: string, @Request() req) {
    // Users can only refresh their own data, admins can access any
    if (req.user?.role !== "admin" && Number.parseInt(userId) !== req.user?.id) {
      throw new UnauthorizedException("Unauthorized access to credit profile")
    }

    return this.creditProfileService.refreshCreditData(Number.parseInt(userId))
  }

  // Admin-only endpoints for easier access
  @Get("admin/all-profiles")
  @Roles("admin")
  async getAllCreditProfiles() {
    const users = await this.usersService.findAll()
    const profiles = []
    
    for (const user of users) {
      try {
        const profile = await this.creditProfileService.getCreditProfile(user.id)
        profiles.push({
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
          },
          profile,
        })
      } catch (error) {
        console.error(`Failed to get profile for user ${user.id}:`, error)
      }
    }
    
    return profiles
  }

  @Get("admin/all-items")
  @Roles("admin")
  async getAllCreditItems() {
    const users = await this.usersService.findAll()
    const allItems = []
    
    for (const user of users) {
      try {
        const items = await this.creditProfileService.getCreditReportItems(user.id)
        allItems.push({
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
          },
          items,
        })
      } catch (error) {
        console.error(`Failed to get items for user ${user.id}:`, error)
      }
    }
    
    return allItems
  }
}
