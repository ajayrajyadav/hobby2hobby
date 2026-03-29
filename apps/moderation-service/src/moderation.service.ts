import { BadRequestException, Injectable } from "@nestjs/common";
import {
  BlockRelationship,
  CreateBlockDto,
  CreateReportDto,
  Report
} from "@hobby2hobby/contracts";
import { ModerationRepository } from "./moderation.repository";

@Injectable()
export class ModerationService {
  constructor(private readonly moderationRepository: ModerationRepository) {}

  createReport(input: CreateReportDto): Promise<Report> {
    return this.moderationRepository.createReport(input);
  }

  listReports(): Promise<Report[]> {
    return this.moderationRepository.listReports();
  }

  async createBlock(input: CreateBlockDto): Promise<BlockRelationship> {
    const block = await this.moderationRepository.createBlock(input);

    if (!block) {
      throw new BadRequestException("Block already exists");
    }

    return block;
  }
}
