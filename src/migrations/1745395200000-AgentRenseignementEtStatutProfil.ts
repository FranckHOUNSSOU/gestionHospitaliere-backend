// src/migrations/1745395200000-AgentRenseignementEtStatutProfil.ts

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AgentRenseignementEtStatutProfil1745395200000
  implements MigrationInterface
{
  name = 'AgentRenseignementEtStatutProfil1745395200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── 1. Ajouter AGENT_RENSEIGNEMENT à l'enum du rôle utilisateur ──────────
    await queryRunner.query(`
      ALTER TYPE "public"."users_role_enum"
      ADD VALUE IF NOT EXISTS 'AGENT_RENSEIGNEMENT'
    `);

    // ── 2. Créer l'enum statut_profil ─────────────────────────────────────────
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."patients_statut_profil_enum"
          AS ENUM ('Complet', 'Incomplet');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `);

    // ── 3. Ajouter statut_profil à la table patients ──────────────────────────
    await queryRunner.query(`
      ALTER TABLE "patients"
      ADD COLUMN IF NOT EXISTS "statut_profil"
        "public"."patients_statut_profil_enum"
        NOT NULL
        DEFAULT 'Incomplet'
    `);

    // ── 4. Ajouter cree_par_id (FK → users.id, ON DELETE SET NULL) ────────────
    await queryRunner.query(`
      ALTER TABLE "patients"
      ADD COLUMN IF NOT EXISTS "cree_par_id" uuid NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "patients"
      ADD CONSTRAINT "FK_patients_cree_par_id"
        FOREIGN KEY ("cree_par_id")
        REFERENCES "users"("id")
        ON DELETE SET NULL
    `);

    // ── 5. Ajouter profil_a_completer à la table sejours ──────────────────────
    await queryRunner.query(`
      ALTER TABLE "sejours"
      ADD COLUMN IF NOT EXISTS "profil_a_completer"
        boolean
        NOT NULL
        DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ── 5. Rollback sejours ───────────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE "sejours" DROP COLUMN IF EXISTS "profil_a_completer"
    `);

    // ── 4. Rollback cree_par_id ───────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE "patients"
      DROP CONSTRAINT IF EXISTS "FK_patients_cree_par_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "patients" DROP COLUMN IF EXISTS "cree_par_id"
    `);

    // ── 3. Rollback statut_profil ─────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE "patients" DROP COLUMN IF EXISTS "statut_profil"
    `);

    // ── 2. Supprimer le type enum ─────────────────────────────────────────────
    await queryRunner.query(`
      DROP TYPE IF EXISTS "public"."patients_statut_profil_enum"
    `);

    // Note: PostgreSQL ne permet pas de supprimer une valeur d'enum.
    // Le rollback de 'AGENT_RENSEIGNEMENT' dans users_role_enum nécessiterait
    // une recréation complète du type avec un cast de colonne. Non implémenté ici.
  }
}
