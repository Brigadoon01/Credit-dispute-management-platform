import { Controller, Get, Request, UseGuards, Param, UnauthorizedException } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { CreditProfileService } from "./credit-profile.service"

@Controller("credit-profile")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreditProfileController {
  constructor(private creditProfileService: CreditProfileService) {}

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
}
