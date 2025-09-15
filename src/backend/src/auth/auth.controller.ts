import { Controller, Get, Request, UseGuards, Redirect, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { Response } from 'express';

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
  async googleAuthCallback(@Request() req, @Res() res: Response) {
    // Google OAuth callback
    const { access_token } = await this.authService.login(req.user);

    // Determine redirect URL based on environment
    const redirectUrl = process.env.APPLICATION_STAGE === 'dev'
      ? 'https://dev.petertconti.com'
      : 'http://localhost:3000';

    // Redirect to frontend with token
    res.redirect(`${redirectUrl}?token=${access_token}`);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return {
      user: req.user,
    };
  }
}