// src/migrations/1746000000000-UserPoleFkEtServiceFk.ts
//
// Transforme la colonne `pole` (enum) de la table `users` en deux FK :
//   - pole_id   → FK vers poles(id)   — transfère les données existantes
//   - service_id → FK vers services(id) — null pour tous les comptes existants
//
// Exécuter AVANT de redémarrer le serveur :
//   npx typeorm-ts-node-commonjs migration:run -d data-source.ts

import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPoleFkEtServiceFk1746000000000 implements MigrationInterface {
  name = 'UserPoleFkEtServiceFk1746000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {

    // ── 1. Ajouter pole_id (UUID nullable, sans contrainte pour l'instant) ──────
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "pole_id" uuid NULL
    `);

    // ── 2. Migrer les données : pole (enum) → pole_id (FK) ───────────────────
    //    Les valeurs de l'enum poles_nom_enum et users_pole_enum sont identiques
    //    (ex. 'POLE MERE'), on joint via CAST TEXT.
    await queryRunner.query(`
      UPDATE "users" u
      SET "pole_id" = p.id
      FROM "poles" p
      WHERE u.pole::TEXT = p.nom::TEXT
        AND u.pole IS NOT NULL
    `);

    // ── 3. Ajouter service_id (UUID nullable) ────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "service_id" uuid NULL
    `);

    // ── 4. Supprimer l'ancienne colonne pole (enum) ──────────────────────────
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "pole"
    `);

    // ── 5. Supprimer le type PostgreSQL orphelin ─────────────────────────────
    await queryRunner.query(`
      DROP TYPE IF EXISTS "public"."users_pole_enum"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    // ── 1. Recréer le type enum PostgreSQL ───────────────────────────────────
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."users_pole_enum"
          AS ENUM ('POLE MERE', 'POLE ENFANT', 'POLE DES SERVICES COMMUNS');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `);

    // ── 2. Recréer la colonne pole (nullable pour ne pas bloquer le rollback) ─
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "pole" "public"."users_pole_enum" NULL
    `);

    // ── 3. Restaurer les données depuis pole_id ──────────────────────────────
    await queryRunner.query(`
      UPDATE "users" u
      SET "pole" = p.nom::TEXT::"public"."users_pole_enum"
      FROM "poles" p
      WHERE u.pole_id = p.id
    `);

    // ── 4. Supprimer service_id ──────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "service_id"
    `);

    // ── 5. Supprimer les FK constraints (TypeORM les nomme avec un hash) ─────
    //    TypeORM a pu les créer au démarrage — on les supprime par leur cible
    await queryRunner.query(`
      DO $$
      DECLARE r RECORD;
      BEGIN
        FOR r IN
          SELECT conname
          FROM pg_constraint
          WHERE conrelid = 'users'::regclass
            AND confrelid IN (
              'poles'::regclass,
              'services'::regclass
            )
        LOOP
          EXECUTE 'ALTER TABLE users DROP CONSTRAINT IF EXISTS "' || r.conname || '"';
        END LOOP;
      END $$
    `);

    // ── 6. Supprimer pole_id ──────────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "pole_id"
    `);
  }
}
