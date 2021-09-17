import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      optionsSuccessStatus: 204,
    },
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3000);
}

bootstrap();
