import { NestFactory } from "@nestjs/core";
import { bootstrapApiApp } from "@hobby2hobby/nest-tools";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await bootstrapApiApp(app, {
    title: "hobby2hobby Identity Service",
    description: "Auth, profiles, and subscription endpoints."
  });
  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
