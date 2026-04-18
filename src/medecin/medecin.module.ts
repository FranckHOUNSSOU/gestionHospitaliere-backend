// src/medecin/medecin.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medecin } from './entities/medecin.entity';
import { MedecinSpecialite } from './entities/medecin-specialite.entity';
import { MedecinDiplome } from './entities/medecin-diplome.entity';
import { MedecinAccreditation } from './entities/medecin-accreditation.entity';
import { MedecinAffectation } from './entities/medecin-affectation.entity';
import { MedecinService } from './medecin.service';
import { MedecinController } from './medecin.controller';
import { AuthModule } from '../auth/auth.module';
import { ServiceModule } from '../service/service.module';
import { User } from '../auth/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medecin,
      MedecinSpecialite,
      MedecinDiplome,
      MedecinAccreditation,
      MedecinAffectation,
      User,          // pour vérifier le rôle lors de la création
    ]),
    AuthModule,      // JwtAuthGuard, RolesGuard, PassportModule
    ServiceModule,   // accès à ServiceRepository (vérif service actif) + TypeOrmModule.forFeature([Service])
  ],
  controllers: [MedecinController],
  providers: [MedecinService],
  exports: [MedecinService, TypeOrmModule],
})
export class MedecinModule {}
