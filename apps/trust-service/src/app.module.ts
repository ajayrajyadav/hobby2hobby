import { Module } from "@nestjs/common";
import { PostgresModule } from "@hobby2hobby/postgres";
import { TrustController } from "./trust.controller";
import { TrustRepository } from "./trust.repository";
import { TrustService } from "./trust.service";

@Module({
  imports: [PostgresModule],
  controllers: [TrustController],
  providers: [TrustService, TrustRepository]
})
export class AppModule {}
