// src/main.ts

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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
      ? ['https://votre-domaine.bj']
      : true,                              // autorise toutes les origines en développement
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // ── Swagger ───────────────────────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Gestion Hospitalière API')
    .setDescription('API REST du système de gestion hospitalière')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'access-token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'refresh-token',
    )
    .addTag('Auth',      'Authentification et gestion de session')
    .addTag('Services',  'Gestion des services hospitaliers')
    .addTag('Médecins',  'Gestion des profils médecins, spécialités, diplômes, accréditations et affectations')
    .addTag('Patients',  'Gestion des dossiers patients, allergies, traitements à risque, contacts et couvertures sociales')
    .addTag('Séjours',   'Gestion des séjours hospitaliers, mouvements, diagnostics, prescriptions, examens, soins et volets cliniques')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(port);
  console.log(`Application démarrée sur http://localhost:${port}/api`);
  console.log(`Swagger disponible sur http://localhost:${port}/api/docs`);
}

bootstrap();