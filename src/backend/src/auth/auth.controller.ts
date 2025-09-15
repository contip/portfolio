import { Controller, Get, Request, UseGuards, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

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
  @Redirect()
  async googleAuthCallback(@Request() req: any) {
    // Google OAuth callback
    const { access_token } = await this.authService.login(req.user);

    // Determine redirect URL based on environment
    const redirectUrl = process.env.APPLICATION_STAGE === 'dev'
      ? 'https://dev.petertconti.com'
      : 'http://localhost:3000';

    return {
      url: `${redirectUrl}?token=${access_token}`,
      statusCode: 302
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return {
      user: req.user,
    };
  }
}