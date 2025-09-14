import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-dynamoose';
import type { Model } from 'nestjs-dynamoose';
import { User, UserKey } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
  ) {}

  async findByGoogleId(googleId: string): Promise<User | null> {
    try {
      const users = await this.userModel.query('googleId').eq(googleId).exec();
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error finding user by Google ID:', error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.userModel.query('email').eq(email).exec();
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.userModel.get({ id });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      ...userData,
    };

    return await this.userModel.create(user);
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      return await this.userModel.update({ id }, updates);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }
}