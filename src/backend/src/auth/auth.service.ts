import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.interface';

export interface GoogleUserData {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateGoogleUser(googleUser: GoogleUserData): Promise<User> {
    // Try to find existing user by Google ID first
    let user = await this.userService.findByGoogleId(googleUser.googleId);

    if (!user) {
      // Try to find by email (in case user exists but no Google ID)
      user = await this.userService.findByEmail(googleUser.email);

      if (user) {
        // Update existing user with Google ID
        user = await this.userService.update(user.id, {
          googleId: googleUser.googleId,
          avatar: googleUser.avatar,
        });
        if (!user) throw new Error('Failed to update user');
      } else {
        // Create new user
        user = await this.userService.create({
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.googleId,
          avatar: googleUser.avatar,
        });
      }
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }

  async validateJwtUser(payload: any): Promise<User | null> {
    return await this.userService.findById(payload.sub);
  }
}