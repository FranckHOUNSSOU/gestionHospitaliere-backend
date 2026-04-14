// src/auth/auth.controller.ts

import {
  Controller,
  Post,
  Get,
  Body,
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
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Inscription', description: 'Crée un compte en attente de validation par l\'administrateur.' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Compte créé, en attente de validation.' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  inscrire(@Body() dto: CreateUserDto) {
    return this.authService.inscrire(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion', description: 'Authentifie un utilisateur et retourne un access token + refresh token.' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Connexion réussie — tokens + infos utilisateur retournés.' })
  @ApiResponse({ status: 401, description: 'Identifiants incorrects ou compte inactif.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('refresh-token')
  @ApiOperation({ summary: 'Renouvellement des tokens', description: 'Génère un nouveau access token + refresh token à partir du refresh token valide.' })
  @ApiResponse({ status: 200, description: 'Nouveaux tokens générés.' })
  @ApiResponse({ status: 401, description: 'Refresh token invalide ou expiré.' })
  rafraichir(@CurrentUser() user: User) {
    return this.authService.rafraichirTokens(user.id);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Déconnexion', description: 'Invalide le refresh token en base de données.' })
  @ApiResponse({ status: 200, description: 'Déconnexion réussie.' })
  @ApiResponse({ status: 401, description: 'Non authentifié.' })
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  @Get('profil')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Profil utilisateur', description: 'Retourne les informations de l\'utilisateur actuellement connecté.' })
  @ApiResponse({ status: 200, description: 'Profil retourné.' })
  @ApiResponse({ status: 401, description: 'Non authentifié.' })
  profil(@CurrentUser() user: User) {
    return this.authService.profil(user.id);
  }
}