import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus, Get } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LocalAuthGuard } from "./guards/local-auth.guard"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { RegisterDto } from "./dto/register.dto"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import { Public } from "./decorators/public.decorator"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('test')
  @Public()
  async test() {
    return { message: "Auth endpoint working", timestamp: new Date().toISOString() }
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    console.log('Received register data:', registerDto)
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Public()
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('regenerate-token')
  @HttpCode(HttpStatus.OK)
  async regenerateToken(@Request() req) {
    return this.authService.regenerateToken(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}
