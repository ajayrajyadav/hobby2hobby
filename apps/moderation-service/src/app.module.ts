import { Module } from "@nestjs/common";
import { PostgresModule } from "@hobby2hobby/postgres";
import { ModerationController } from "./moderation.controller";
import { ModerationRepository } from "./moderation.repository";
import { ModerationService } from "./moderation.service";

@Module({
  imports: [PostgresModule],
  controllers: [ModerationController],
  providers: [ModerationService, ModerationRepository]
})
export class AppModule {}
