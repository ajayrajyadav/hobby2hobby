export type ReportTargetType = "user" | "listing" | "message" | "review";

export interface CreateReportDto {
  reporterUserId: string;
  targetType: ReportTargetType;
  targetId: string;
  reasonCode: string;
  details?: string;
}

export interface CreateBlockDto {
  blockerUserId: string;
  blockedUserId: string;
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
