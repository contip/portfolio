import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('google.clientId')!,
      clientSecret: configService.get<string>('google.clientSecret')!,
      callbackURL: configService.get<string>('google.callbackUrl')!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const email = emails[0]?.value;

    // Check email whitelist
    const allowedEmails = this.configService.get<string[]>('auth.allowedEmails') || [];
    if (!allowedEmails.includes(email)) {
      throw new UnauthorizedException(`Access denied for ${email}. Not in whitelist.`);
    }

    const googleUser = {
      googleId: id,
      email: email,
      name: `${name?.givenName} ${name?.familyName}`.trim(),
      avatar: photos?.[0]?.value,
    };

    // Find or create user
    const user = await this.authService.validateGoogleUser(googleUser);

    done(null, user);
  }
}