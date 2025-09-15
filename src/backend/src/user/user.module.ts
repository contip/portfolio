import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';

@Module({
  imports: [
    DynamooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: (configService: ConfigService) => ({
          schema: UserSchema,
          options: {
            tableName: `users-${configService.get('applicationStage')}`,
          },
        }),
        inject: [ConfigService],
        imports: [ConfigModule],
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}