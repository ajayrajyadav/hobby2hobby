import { NestFactory } from "@nestjs/core";
import { bootstrapApiApp } from "@hobby2hobby/nest-tools";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await bootstrapApiApp(app, {
    title: "hobby2hobby Messaging Service",
    description: "Threads, messages, proposals, and agreements."
  });
  await app.listen(process.env.PORT ?? 3003);
}

void bootstrap();
