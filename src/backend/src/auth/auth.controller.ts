import { Controller, Get, Request, UseGuards, Res, HttpStatus } from '@nestjs/common';
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
    // Initiates Google OAuth flow - Guard handles redirect to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Request() req: any, @Res() res: Response) {
    try {
      // The GoogleAuthGuard handles OAuth validation and populates req.user
      if (!req.user) {
        // If no user, redirect with error
        const redirectUrl = process.env.APPLICATION_STAGE === 'dev'
          ? 'https://dev.petertconti.com'
          : 'http://localhost:3000';
        return res.redirect(`${redirectUrl}?error=auth_failed`);
      }

      // Generate JWT for the authenticated user
      const { access_token } = await this.authService.login(req.user);

      // Determine redirect URL based on environment
      const redirectUrl = process.env.APPLICATION_STAGE === 'dev'
        ? 'https://dev.petertconti.com'
        : 'http://localhost:3000';

      // Manually handle redirect for Lambda compatibility
      res.status(HttpStatus.FOUND);
      res.setHeader('Location', `${redirectUrl}?token=${access_token}`);
      return res.end();
    } catch (error) {
      console.error('OAuth callback error:', error);
      const redirectUrl = process.env.APPLICATION_STAGE === 'dev'
        ? 'https://dev.petertconti.com'
        : 'http://localhost:3000';

      res.status(HttpStatus.FOUND);
      res.setHeader('Location', `${redirectUrl}?error=auth_failed`);
      return res.end();
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