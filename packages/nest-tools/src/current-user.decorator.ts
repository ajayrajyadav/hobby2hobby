import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { extractUserId } from "./dev-auth.guard";

export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | undefined => {
    const request = context.switchToHttp().getRequest<{
      userId?: string;
      headers: Record<string, string | undefined>;
    }>();

    return request.userId ?? extractUserId(request.headers.authorization) ?? undefined;
  }
);
