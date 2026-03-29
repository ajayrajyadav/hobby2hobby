import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  BlockRelationship,
  CreateBlockDto,
  CreateReportDto,
  Report
} from "@hobby2hobby/contracts";

@Injectable()
export class ModerationService {
  private readonly reports: Report[] = [];
  private readonly blocks: BlockRelationship[] = [];

  createReport(input: CreateReportDto): Report {
    const report: Report = {
      id: randomUUID(),
      status: "open",
      ...input
    };

    this.reports.push(report);

    return report;
  }

  listReports(): Report[] {
    return this.reports;
  }

  createBlock(input: CreateBlockDto): BlockRelationship {
    const exists = this.blocks.find(
      (block) =>
        block.blockerUserId === input.blockerUserId &&
        block.blockedUserId === input.blockedUserId
    );

    if (exists) {
      throw new BadRequestException("Block already exists");
    }

    const block: BlockRelationship = {
      id: randomUUID(),
      ...input
    };

    this.blocks.push(block);

    return block;
  }
}
