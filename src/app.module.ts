// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/users/entities/user.entity';

@Module({
  imports: [
    // ── Variables d'environnement ──────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,      // accessible partout sans réimporter
      envFilePath: '.env',
    }),

    // ── Base de données PostgreSQL via TypeORM ────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User],
        // synchronize: true uniquement en développement
        // En production : utiliser les migrations TypeORM
        synchronize: config.get<string>('NODE_ENV') === 'development',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    // ── Modules métier ────────────────────────────────────────────────────
    AuthModule,
  ],
})
export class AppModule {}