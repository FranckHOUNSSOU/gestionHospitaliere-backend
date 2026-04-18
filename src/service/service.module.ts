// src/service/service.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    AuthModule,   // JwtAuthGuard, RolesGuard, PassportModule
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService, TypeOrmModule],  // TypeOrmModule exporté pour que MedecinModule accède à ServiceRepository
})
export class ServiceModule {}
