import { Controller, Get, Request, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Request() req: any, @Res() res: Response) {
    if (!req.user) {
      const redirectUrl = process.env.APPLICATION_STAGE === 'dev'
        ? 'https://dev.petertconti.com'
        : 'http://localhost:3000';
      res.status(HttpStatus.FOUND).setHeader('Location', `${redirectUrl}?error=auth_failed`);
      return res.end();
    }

    const { access_token } = await this.authService.login(req.user);
    const redirectUrl = process.env.APPLICATION_STAGE === 'dev'
      ? 'https://dev.petertconti.com'
      : 'http://localhost:3000';

    res.status(HttpStatus.FOUND).setHeader('Location', `${redirectUrl}?token=${access_token}`);
    return res.end();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return {
      user: req.user,
    };
  }
}
