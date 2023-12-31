import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser = require('cookie-parser');
import * as express from 'express';
import Logging from './library/Logging';
import { AllExceptionsFilter } from './helpers/GlobalExceptionFilter';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  // Setup session storage
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup to serve static files
  app.use('/files', express.static('files'));

  // Setup global filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // Setup Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Geotagger App API')
    .setDescription('Guess where your friends are!')
    .setVersion('1.0')
    .addTag('Geotagger')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the backend server
  const PORT = process.env.PORT || 8080;
  await app.listen(PORT);

  Logging.info(`App is listening on: ${await app.getUrl()}`);
}
bootstrap();
