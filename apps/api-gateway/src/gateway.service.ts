import { HttpException, Injectable } from "@nestjs/common";

type ServiceName =
  | "identity"
  | "marketplace"
  | "messaging"
  | "trust"
  | "moderation";

@Injectable()
export class GatewayService {
  health(): { status: string; services: Record<string, string> } {
    return {
      status: "ok",
      services: this.serviceUrls
    };
  }

  async proxy(
    service: ServiceName,
    method: "GET" | "POST" | "PATCH",
    path: string,
    query?: Record<string, string>,
    body?: unknown
  ): Promise<unknown> {
    const url = new URL(`${this.serviceUrls[service]}/${path}`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.set(key, value);
        }
      }
    }

    const response = await fetch(url, {
      method,
      headers: {
        "content-type": "application/json"
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const text = await response.text();
    const payload = text.length > 0 ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new HttpException(payload ?? { message: "Proxy request failed" }, response.status);
    }

    return payload;
  }

  private get serviceUrls(): Record<ServiceName, string> {
    return {
      identity: process.env.IDENTITY_SERVICE_URL ?? "http://localhost:3001",
      marketplace: process.env.MARKETPLACE_SERVICE_URL ?? "http://localhost:3002",
      messaging: process.env.MESSAGING_SERVICE_URL ?? "http://localhost:3003",
      trust: process.env.TRUST_SERVICE_URL ?? "http://localhost:3004",
      moderation: process.env.MODERATION_SERVICE_URL ?? "http://localhost:3005"
    };
  }
}
