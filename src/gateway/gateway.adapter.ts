import { IoAdapter } from '@nestjs/platform-socket.io';
import { getRepository } from 'typeorm';
import { AuthenticatedSocket } from '../utils/types';
import { Session, User } from '../utils/typeorm/entities';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';
import { plainToInstance } from 'class-transformer';

export class WebsocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    const sessionRepository = getRepository(Session);
    const server = super.createIOServer(port, { ...options });
    server.use(async (socket: AuthenticatedSocket, next) => {
      const { cookie: clientCookie } = socket.handshake.headers;
      if (!clientCookie) {
        console.log('Client has no cookies');
        return next(new Error('Not Authenticated. No cookies were sent'));
      }
      const { SYNCED_APP_SESSION_ID } = cookie.parse(clientCookie);
      if (!SYNCED_APP_SESSION_ID) {
        console.log('SYNCED_APP_SESSION_ID DOES NOT EXIST');
        return next(new Error('Not Authenticated'));
      }
      const signedCookie = cookieParser.signedCookie(
        SYNCED_APP_SESSION_ID,
        process.env.COOKIE_SECRET,
      );
      if (!signedCookie) return next(new Error('Error signing cookie'));
      const sessionDB = await sessionRepository.findOne({ id: signedCookie });
      if (!sessionDB) return next(new Error('No session found'));
      const userDB = plainToInstance(
        User,
        JSON.parse(sessionDB.data).passport.user,
      );
      socket.user = userDB;
      next();
    });
    return server;
  }
}
