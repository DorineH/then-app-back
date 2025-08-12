// import * as nodeCrypto from 'node:crypto';

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  });

  const config = new DocumentBuilder()
    .setTitle("My API")
    .setDescription(
      "La documentation de mon API NestJS avec Swagger pour mon projet Then",
    )
    .setVersion("1.0")
    // .addTag("users")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "bearerAuth",
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  await app.listen(process.env.PORT ?? 3001, "0.0.0.0");
}
bootstrap();
