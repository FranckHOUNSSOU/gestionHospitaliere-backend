// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ServiceModule } from './service/service.module';
import { MedecinModule } from './medecin/medecin.module';
import { PatientModule } from './patient/patient.module';

// ── Entités ───────────────────────────────────────────────────────────────────
import { User } from './auth/users/entities/user.entity';
import { Service } from './service/service.entity';
import { Medecin } from './medecin/entities/medecin.entity';
import { MedecinSpecialite } from './medecin/entities/medecin-specialite.entity';
import { MedecinDiplome } from './medecin/entities/medecin-diplome.entity';
import { MedecinAccreditation } from './medecin/entities/medecin-accreditation.entity';
import { MedecinAffectation } from './medecin/entities/medecin-affectation.entity';
import { Patient } from './patient/entities/patient.entity';
import { Allergie } from './patient/entities/allergie.entity';
import { TraitementARisque } from './patient/entities/traitement-a-risque.entity';
import { ContactUrgence } from './patient/entities/contact-urgence.entity';
import { CouvertureSociale } from './patient/entities/couverture-sociale.entity';
import { Sejour } from './patient/entities/sejour.entity';
import { Mouvement } from './patient/entities/mouvement.entity';
import { Diagnostic } from './patient/entities/diagnostic.entity';
import { Prescription } from './patient/entities/prescription.entity';
import { Examen } from './patient/entities/examen.entity';
import { ResultatExamen } from './patient/entities/resultat-examen.entity';
import { Constante } from './patient/entities/constante.entity';
import { SoinInfirmier } from './patient/entities/soin-infirmier.entity';
import { CompteRendu } from './patient/entities/compte-rendu.entity';
import { Consentement } from './patient/entities/consentement.entity';
import { VoletAnesthesie } from './patient/entities/volet-anesthesie.entity';
import { VoletSocial } from './patient/entities/volet-social.entity';
import { VoletNutritionnel } from './patient/entities/volet-nutritionnel.entity';

@Module({
  imports: [
    // ── Variables d'environnement ──────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
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
        entities: [
          // Auth
          User,
          // Service
          Service,
          // Médecin
          Medecin,
          MedecinSpecialite,
          MedecinDiplome,
          MedecinAccreditation,
          MedecinAffectation,
          // Patient
          Patient,
          Allergie,
          TraitementARisque,
          ContactUrgence,
          CouvertureSociale,
          Sejour,
          Mouvement,
          Diagnostic,
          Prescription,
          Examen,
          ResultatExamen,
          Constante,
          SoinInfirmier,
          CompteRendu,
          Consentement,
          VoletAnesthesie,
          VoletSocial,
          VoletNutritionnel,
        ],
        // synchronize: true uniquement en développement
        // En production : utiliser les migrations TypeORM
        synchronize: config.get<string>('NODE_ENV') === 'development',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    // ── Modules métier ────────────────────────────────────────────────────
    AuthModule,
    ServiceModule,
    MedecinModule,
    PatientModule,
  ],
})
export class AppModule {}
