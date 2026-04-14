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
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Création d'un compte (en attente de validation par l'admin)
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  inscrire(@Body() dto: CreateUserDto) {
    return this.authService.inscrire(dto);
  }

  /**
   * POST /auth/login
   * Connexion — retourne accessToken + refreshToken + infos utilisateur
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * POST /auth/refresh
   * Renouvellement des tokens via le refresh token (Bearer header)
   */
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  rafraichir(@CurrentUser() user: User) {
    return this.authService.rafraichirTokens(user.id);
  }

  /**
   * POST /auth/logout
   * Déconnexion — invalide le refresh token en base
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  /**
   * GET /auth/profil
   * Retourne le profil de l'utilisateur connecté
   */
  @Get('profil')
  @UseGuards(JwtAuthGuard)
  profil(@CurrentUser() user: User) {
    return this.authService.profil(user.id);
  }
}