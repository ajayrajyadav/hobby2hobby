import { NestFactory } from "@nestjs/core";
import { bootstrapApiApp } from "@hobby2hobby/nest-tools";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await bootstrapApiApp(app, {
    title: "hobby2hobby Trust Service",
    description: "Reviews, vouches, and trust summary endpoints."
  });
  await app.listen(process.env.PORT ?? 3004);
}

void bootstrap();
