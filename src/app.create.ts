import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
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

export function appCreate(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  const config = new DocumentBuilder()
    .addServer(`http://localhost:${appConfig().port}/`)
    .setTitle('Help Central Backend API Gateway')
    .setDescription('Help Central API Gateway Documentation')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    // .addBearerAuth(
    //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    //   'refresh-token',
    // )
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
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  app.enableCors({
    origin: '*',
    credentials: true,
  });
}
