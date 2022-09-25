import { Inject } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Services } from 'src/utils/constants';
import { AuthenticatedSocket } from 'src/utils/types';
import { GatewaySessionManager } from './gateway.session';

@WebSocketGateway()
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER_SERVICE)
    private readonly sessionManager: GatewaySessionManager,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log(`Incomming connection from ${socket.user.name}`);
    this.sessionManager.setUserSocket(socket.user.id, socket);
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log(`${socket.user.name} disconnected.`);
    this.sessionManager.removeUserSocket(socket.user.id);
  }
}
