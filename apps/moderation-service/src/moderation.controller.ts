import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post
} from "@nestjs/common";
import {
  BlockRelationship,
  CreateBlockDto,
  CreateReportDto,
  Report
} from "@hobby2hobby/contracts";
import { CurrentUserId } from "@hobby2hobby/nest-tools";
import { ModerationService } from "./moderation.service";

@Controller()
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post("reports")
  createReport(
    @CurrentUserId() currentUserId: string,
    @Body() body: CreateReportDto
  ): Promise<Report> {
    if (currentUserId !== body.reporterUserId) {
      throw new ForbiddenException("Reporter must match the authenticated user");
    }

    return this.moderationService.createReport(body);
  }

  @Get("reports")
  listReports(): Promise<Report[]> {
    return this.moderationService.listReports();
  }

  @Post("blocks")
  createBlock(
    @CurrentUserId() currentUserId: string,
    @Body() body: CreateBlockDto
  ): Promise<BlockRelationship> {
    if (currentUserId !== body.blockerUserId) {
      throw new ForbiddenException("Blocker must match the authenticated user");
    }

    return this.moderationService.createBlock(body);
  }
}
