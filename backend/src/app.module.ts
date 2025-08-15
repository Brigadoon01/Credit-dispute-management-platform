import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_GUARD, APP_PIPE } from "@nestjs/core"
import { Reflector } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { DatabaseModule } from "./database/database.module"
import { CreditProfileModule } from "./credit-profile/credit-profile.module"
import { DisputesModule } from "./disputes/disputes.module"
import { AiModule } from "./ai/ai.module"
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard"
import { RolesGuard } from "./auth/guards/roles.guard"


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CreditProfileModule,
    DisputesModule,
    AiModule,
  ],
  providers: [
    Reflector,
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
