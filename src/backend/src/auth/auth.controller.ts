import { Controller, Get, Request, UseGuards, Res } from '@nestjs/common';
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
  async googleAuth(@Request() req: any) {
    // Initiates Google OAuth flow
    // Guard handles the redirect
    return { message: 'Redirecting to Google...' };
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Request() req: any, @Res() res: Response) {
    try {
      // Google OAuth callback - req.user is populated by Passport
      if (!req.user) {
        return res.redirect('https://dev.petertconti.com?error=auth_failed');
      }

      const { access_token } = await this.authService.login(req.user);

      // Determine redirect URL based on environment
      const redirectUrl = process.env.APPLICATION_STAGE === 'dev'
        ? 'https://dev.petertconti.com'
        : 'http://localhost:3000';

      // Redirect to frontend with token
      return res.redirect(`${redirectUrl}?token=${access_token}`);
    } catch (error) {
      console.error('Auth callback error:', error);
      const redirectUrl = process.env.APPLICATION_STAGE === 'dev'
        ? 'https://dev.petertconti.com'
        : 'http://localhost:3000';
      return res.redirect(`${redirectUrl}?error=auth_failed`);
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return {
      user: req.user,
    };
  }
}