// data-source.ts — Configuration TypeORM pour le CLI de migrations
// Usage : npx typeorm-ts-node-commonjs migration:generate src/migrations/<NomMigration> -d data-source.ts
//         npx typeorm-ts-node-commonjs migration:run -d data-source.ts

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host:     process.env.DB_HOST     ?? 'localhost',
  port:     parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
