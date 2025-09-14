import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamooseModule } from 'nestjs-dynamoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CatsModule } from './cats/cats.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    DynamooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        aws: {
          accessKeyId: configService.get('aws.accessKeyId'),
          secretAccessKey: configService.get('aws.secretAccessKey'),
          region: configService.get('aws.region'),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
