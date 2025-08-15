import { Module } from "@nestjs/common"
import { CreditProfileController } from "./credit-profile.controller"
import { CreditProfileService } from "./credit-profile.service"
import { MockCreditProviderService } from "./mock-credit-provider.service"
import { DatabaseModule } from "../database/database.module"
import { UsersModule } from "../users/users.module"

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [CreditProfileController],
  providers: [CreditProfileService, MockCreditProviderService],
  exports: [CreditProfileService],
})
export class CreditProfileModule {}
