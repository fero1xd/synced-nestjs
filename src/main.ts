import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

import { getRepository } from 'typeorm';
import { Session } from './utils/typeorm/entities';
import { TypeormStore } from 'typeorm-store';
import { WebsocketAdapter } from './gateway/gateway.adapter';

async function bootstrap() {
  const { COOKIE_SECRET } = process.env;

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');
  app.useWebSocketAdapter(new WebsocketAdapter(app));

  const sessionRepository = getRepository(Session);

  app.use(
    session({
      secret: COOKIE_SECRET,
      saveUninitialized: false,
      resave: false,
      name: 'SYNCED_APP_SESSION_ID',
      cookie: {
        maxAge: 86400000,
      },
      store: new TypeormStore({ repository: sessionRepository }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3001);
}
bootstrap();
