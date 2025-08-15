import { Controller, Post, Body, Request, UseGuards, UnauthorizedException } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { AiService } from "./ai.service"
import { GenerateLetterDto } from "./dto/generate-letter.dto"

@Controller("ai")
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post("generate-letter")
  async generateDisputeLetter(@Body() generateLetterDto: GenerateLetterDto, @Request() req) {
    if (!req.user?.id) {
      throw new UnauthorizedException("User not authenticated")
    }
    
    return this.aiService.generateDisputeLetter({
      ...generateLetterDto,
      user_id: req.user.id,
    })
  }
}
