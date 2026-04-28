// src/service/service.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pole } from './pole.entity';
import { Service } from './service.entity';
import { Chambre } from './chambre.entity';
import { Lit } from './lit.entity';
import { MedecinAffectation } from '../medecin/entities/medecin-affectation.entity';
import { User } from '../auth/users/entities/user.entity';

import { PoleService } from './pole.service';
import { ServiceService } from './service.service';
import { ChambreService } from './chambre.service';
import { LitService } from './lit.service';

import { PoleController } from './pole.controller';
import { ServiceController } from './service.controller';
import { ChambreController } from './chambre.controller';
import { LitController } from './lit.controller';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pole, Service, Chambre, Lit, MedecinAffectation, User]),
    AuthModule,
  ],
  controllers: [PoleController, ServiceController, ChambreController, LitController],
  providers: [PoleService, ServiceService, ChambreService, LitService],
  exports: [PoleService, ServiceService, ChambreService, LitService, TypeOrmModule],
})
export class ServiceModule {}
