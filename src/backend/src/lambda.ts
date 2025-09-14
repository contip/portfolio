import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverlessExpress from '@vendia/serverless-express';
import { APIGatewayProxyHandler } from 'aws-lambda';

let server: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for dev domain
  app.enableCors({
    origin: ['https://dev.petertconti.com', 'https://www.petertconti.com', 'http://localhost:3000'],
    credentials: true,
  });

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
  server = server ?? (await bootstrap());
  return server(event, context);
};