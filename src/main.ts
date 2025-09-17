import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PaginationMeta } from './shared/common/abstract.interface';
import appConfig from './shared/config/index.config';
import {
  APIErrorResponse,
  APIValidationErrorResponse,
} from './shared/dto/error-response.dto';
import {
  APISSuccessResponsePaginated,
  APISuccessResponse,
} from './shared/dto/success-response.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .addServer(`http://localhost:${appConfig().port}/`)
    .setTitle('Help Central Backend API Gateway')
    .setDescription('Help Central API Gateway Documentation')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refresh-token',
    )
    .addSecurityRequirements('access-token')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      APISuccessResponse,
      APISSuccessResponsePaginated,
      PaginationMeta,
      APIErrorResponse,
      APIValidationErrorResponse,
    ],
  });

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: { persistAuthorization: true },
  };

  SwaggerModule.setup('api', app, document, customOptions);
  await app.listen(appConfig().port, async () =>
    console.log(`Application is running on port: ${await app.getUrl()}`),
  );
}
bootstrap();
