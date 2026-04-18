// src/medecin/dto/update-medecin.dto.ts

import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateMedecinDto } from './create-medecin.dto';

// On exclut userId : l'association utilisateur ne peut pas changer après la création.
export class UpdateMedecinDto extends PartialType(
  OmitType(CreateMedecinDto, ['userId'] as const),
) {}
