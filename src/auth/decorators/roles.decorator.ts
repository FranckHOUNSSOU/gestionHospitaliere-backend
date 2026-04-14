import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity';

export const ROLES_KEY = 'roles';

/**
 * Décorateur pour restreindre une route à certains rôles.
 * @example
 *   @Roles(UserRole.MEDECIN, UserRole.ADMINISTRATEUR)
 *   @UseGuards(JwtAuthGuard, RolesGuard)
 *   findAll() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);