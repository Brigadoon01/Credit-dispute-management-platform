import { Controller, Post, Get, Put, Body, Request, Param, Query, UseGuards, UnauthorizedException } from "@nestjs/common"
import { DisputesService } from "./disputes.service"
import { CreateDisputeDto } from "./dto/create-dispute.dto"
import { UpdateDisputeStatusDto } from "./dto/update-dispute-status.dto"
import { Roles } from "../auth/decorators/roles.decorator"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"

@Controller("disputes")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DisputesController {
  constructor(private disputesService: DisputesService) {}

  @Post("create")
  async createDispute(@Body() createDisputeDto: CreateDisputeDto, @Request() req) {
    if (!req.user?.id) {
      throw new UnauthorizedException("User not authenticated")
    }
    
    return this.disputesService.createDispute({
      ...createDisputeDto,
      user_id: req.user.id,
    })
  }

  @Get("history")
  async getDisputeHistory(@Request() req, @Query("status") status?: string) {
    if (!req.user?.id) {
      throw new UnauthorizedException("User not authenticated")
    }
    
    if (req.user.role === "admin") {
      return this.disputesService.getAllDisputes(status)
    }
    return this.disputesService.getUserDisputes(req.user.id, status)
  }

  @Get(":id")
  async getDispute(@Param("id") id: string, @Request() req) {
    if (!req.user?.id) {
      throw new UnauthorizedException("User not authenticated")
    }
    
    const dispute = await this.disputesService.getDisputeById(Number(id))
    if (req.user.role !== "admin" && dispute.user_id !== req.user.id) {
      throw new UnauthorizedException("Unauthorized access to dispute")
    }
    return dispute
  }

  @Put(":id/status")
  @Roles("admin")
  async updateDisputeStatus(@Param("id") id: string, @Body() updateStatusDto: UpdateDisputeStatusDto) {
    return this.disputesService.updateDisputeStatus(Number(id), updateStatusDto)
  }

  @Get("stats/overview")
  @Roles("admin")
  async getDisputeStats() {
    return this.disputesService.getDisputeStats()
  }
}
