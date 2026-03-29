import { Controller, Get } from "@nestjs/common";

@Controller()
export class GatewayController {
  @Get("health")
  health(): { status: string; services: Record<string, string> } {
    return {
      status: "ok",
      services: {
        identity: process.env.IDENTITY_SERVICE_URL ?? "http://localhost:3001",
        marketplace: process.env.MARKETPLACE_SERVICE_URL ?? "http://localhost:3002",
        messaging: process.env.MESSAGING_SERVICE_URL ?? "http://localhost:3003",
        trust: process.env.TRUST_SERVICE_URL ?? "http://localhost:3004",
        moderation: process.env.MODERATION_SERVICE_URL ?? "http://localhost:3005"
      }
    };
  }
}
