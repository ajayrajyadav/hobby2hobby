import { Body, Controller, Get, Post } from "@nestjs/common";
import {
  BlockRelationship,
  CreateBlockDto,
  CreateReportDto,
  Report
} from "@hobby2hobby/contracts";
import { ModerationService } from "./moderation.service";

@Controller()
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post("reports")
  createReport(@Body() body: CreateReportDto): Promise<Report> {
    return this.moderationService.createReport(body);
  }

  @Get("reports")
  listReports(): Promise<Report[]> {
    return this.moderationService.listReports();
  }

  @Post("blocks")
  createBlock(@Body() body: CreateBlockDto): Promise<BlockRelationship> {
    return this.moderationService.createBlock(body);
  }
}
