import { IsIn, IsOptional, IsString, MinLength } from "class-validator";

export type ReportTargetType = "user" | "listing" | "message" | "review";

export class CreateReportDto {
  @IsString()
  @MinLength(1)
  reporterUserId!: string;

  @IsIn(["user", "listing", "message", "review"])
  targetType!: ReportTargetType;

  @IsString()
  @MinLength(1)
  targetId!: string;

  @IsString()
  @MinLength(1)
  reasonCode!: string;

  @IsOptional()
  @IsString()
  details?: string;
}

export class CreateBlockDto {
  @IsString()
  @MinLength(1)
  blockerUserId!: string;

  @IsString()
  @MinLength(1)
  blockedUserId!: string;
}

export interface Report {
  id: string;
  reporterUserId: string;
  targetType: ReportTargetType;
  targetId: string;
  reasonCode: string;
  details?: string;
  status: "open" | "resolved";
}

export interface BlockRelationship {
  id: string;
  blockerUserId: string;
  blockedUserId: string;
}
