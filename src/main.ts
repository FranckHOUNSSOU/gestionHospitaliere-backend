// src/main.ts

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // ── Validation globale des DTOs ──────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // supprime les champs non déclarés dans le DTO
      forbidNonWhitelisted: true, // lève une erreur si champ inconnu reçu
      transform: true,            // transforme les types automatiquement
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ── Préfixe global des routes ─────────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ── CORS (à adapter selon l'origine de ton frontend) ─────────────────────
  app.enableCors({
    origin: nodeEnv === 'production'
      ? ['https://votre-domaine.bj']       // URL du frontend en production
      : ['http://localhost:5173', 'http://localhost:3001'], // Vite/React dev
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  await app.listen(port);
  console.log(`Application démarrée sur http://localhost:${port}/api`);
}

bootstrap();