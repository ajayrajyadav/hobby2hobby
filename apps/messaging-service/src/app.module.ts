import { Module } from "@nestjs/common";
import { PostgresModule } from "@hobby2hobby/postgres";
import { MessagingController } from "./messaging.controller";
import { MessagingRepository } from "./messaging.repository";
import { MessagingService } from "./messaging.service";

@Module({
  imports: [PostgresModule],
  controllers: [MessagingController],
  providers: [MessagingService, MessagingRepository]
})
export class AppModule {}
