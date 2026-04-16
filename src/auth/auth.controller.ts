import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { MessageResponse, AuthTokensResponse, LoginResponse } from './dto/auth.responses';
import { CreateUserByAdminDto } from './users/dto/create-user-by-admin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { User, UserRole } from './users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Inscription administrateur',
    description: 'Crée le compte administrateur unique du système (actif immédiatement). Échoue si un administrateur existe déjà.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Compte administrateur créé et activé.', type: MessageResponse })
  @ApiResponse({ status: 409, description: 'Un administrateur existe déjà ou email déjà utilisé.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 403, description: 'Seul le rôle ADMINISTRATEUR peut s\'inscrire via cette route.' })
  inscrire(@Body() dto: CreateUserDto) {
    return this.authService.inscrire(dto);
  }

  // ── ROUTES RÉSERVÉES À L'ADMINISTRATEUR ──────────────────────────────────

  @Post('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Créer un compte (admin)',
    description: 'L\'administrateur crée un compte MEDECIN ou AGENT_ADMINISTRATIF. Le compte est inactif par défaut.',
  })
  @ApiBody({ type: CreateUserByAdminDto })
  @ApiResponse({ status: 201, description: 'Compte créé avec succès.', type: MessageResponse })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé.' })
  @ApiResponse({ status: 403, description: 'Accès réservé à l\'administrateur.' })
  creerCompte(@CurrentUser() admin: User, @Body() dto: CreateUserByAdminDto) {
    return this.authService.creerCompteParAdmin(admin.id, dto);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Lister les utilisateurs (admin)', description: 'Retourne tous les utilisateurs du système.' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs.', type: [User] })
  @ApiResponse({ status: 403, description: 'Accès réservé à l\'administrateur.' })
  listerUtilisateurs() {
    return this.authService.listerUtilisateurs();
  }

  @Patch('users/:id/activer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Activer un compte (admin)', description: 'Active le compte d\'un utilisateur.' })
  @ApiResponse({ status: 200, description: 'Compte activé.', type: MessageResponse })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
  @ApiResponse({ status: 403, description: 'Accès réservé à l\'administrateur.' })
  activerCompte(@Param('id') id: string) {
    return this.authService.activerCompte(id);
  }

  @Patch('users/:id/desactiver')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Désactiver un compte (admin)', description: 'Désactive le compte d\'un utilisateur.' })
  @ApiResponse({ status: 200, description: 'Compte désactivé.', type: MessageResponse })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
  @ApiResponse({ status: 403, description: 'Accès réservé à l\'administrateur.' })
  desactiverCompte(@Param('id') id: string) {
    return this.authService.desactiverCompte(id);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion', description: 'Authentifie un utilisateur et retourne un access token + refresh token.' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Connexion réussie.', type: LoginResponse })
  @ApiResponse({ status: 401, description: 'Identifiants incorrects.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('refresh-token')
  @ApiOperation({ summary: 'Renouvellement des tokens', description: 'Génère de nouveaux tokens à partir du refresh token (à passer en Bearer).' })
  @ApiResponse({ status: 200, description: 'Nouveaux tokens générés.', type: AuthTokensResponse })
  @ApiResponse({ status: 401, description: 'Refresh token invalide ou expiré.' })
  rafraichir(@CurrentUser() user: User) {
    return this.authService.rafraichirTokens(user.id);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Déconnexion', description: 'Invalide le refresh token en base de données.' })
  @ApiResponse({ status: 200, description: 'Déconnexion réussie.', type: MessageResponse })
  @ApiResponse({ status: 401, description: 'Non authentifié.' })
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  @Get('profil')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Profil utilisateur', description: 'Retourne les informations de l\'utilisateur actuellement connecté.' })
  @ApiResponse({ status: 200, description: 'Profil retourné.', type: User })
  @ApiResponse({ status: 401, description: 'Non authentifié.' })
  profil(@CurrentUser() user: User) {
    return this.authService.profil(user.id);
  }
}