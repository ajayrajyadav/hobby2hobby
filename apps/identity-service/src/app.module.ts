import { Module } from "@nestjs/common";
import { PostgresModule } from "@hobby2hobby/postgres";
import { IdentityController } from "./identity.controller";
import { IdentityRepository } from "./identity.repository";
import { IdentityService } from "./identity.service";

@Module({
  imports: [PostgresModule],
  controllers: [IdentityController],
  providers: [IdentityService, IdentityRepository]
})
export class AppModule {}
