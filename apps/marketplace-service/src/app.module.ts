import { Module } from "@nestjs/common";
import { PostgresModule } from "@hobby2hobby/postgres";
import { MarketplaceController } from "./marketplace.controller";
import { MarketplaceRepository } from "./marketplace.repository";
import { MarketplaceService } from "./marketplace.service";

@Module({
  imports: [PostgresModule],
  controllers: [MarketplaceController],
  providers: [MarketplaceService, MarketplaceRepository]
})
export class AppModule {}
