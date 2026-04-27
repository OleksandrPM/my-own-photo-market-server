import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('My Own Photo Market API')
  .setDescription('REST API documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
