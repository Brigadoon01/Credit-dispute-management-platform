import { Module } from "@nestjs/common"
import { AiController } from "./ai.controller"
import { AiService } from "./ai.service"
import { DisputesModule } from "../disputes/disputes.module"
import { DatabaseModule } from "../database/database.module"

@Module({
  imports: [DisputesModule, DatabaseModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
