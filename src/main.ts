import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.ORIGIN_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  const config = app.get(ConfigService);

  const port = parseInt(config.get<string>('PORT') ?? '3001', 10);

  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
});
