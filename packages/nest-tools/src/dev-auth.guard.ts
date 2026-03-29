import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./public.decorator";

@Injectable()
export class DevAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; userId?: string }>();
    const userId = extractUserId(request.headers.authorization);

    if (!userId) {
      throw new UnauthorizedException("Missing or invalid bearer token");
    }

    request.userId = userId;
    return true;
  }
}

export function extractUserId(authorizationHeader?: string): string | null {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  if (!token.startsWith("dev-token-")) {
    return null;
  }

  const userId = token.slice("dev-token-".length).trim();
  return userId.length > 0 ? userId : null;
}
