import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Events, Services } from 'src/utils/constants';
import { AuthenticatedSocket, JobPayload } from 'src/utils/types';
import { GatewaySessionManager } from './gateway.session';
import { OnEvent } from '@nestjs/event-emitter';
import { instanceToPlain } from 'class-transformer';
import { Job, Project, User } from 'src/utils/typeorm/entities';

@WebSocketGateway(3002, {
  path: '/ws',
  cors: {
    origin: ['http://localhost:3000', process.env.LOCAL_WEB],
    credentials: true,
  },
})
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER_SERVICE)
    private readonly sessionManager: GatewaySessionManager,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket) {
    console.log(`Incomming connection from ${socket.user.name}`);
    this.sessionManager.setUserSocket(socket.user.id, socket);
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log(`${socket.user.name} disconnected.`);
    this.sessionManager.removeUserSocket(socket.user.id);
  }

  @SubscribeMessage('onProjectJoin')
  onProjectJoin(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('onProjectJoin');
    client.join(`project-${data.projectId}`);
    console.log(client.rooms);
  }

  @SubscribeMessage('onProjectLeave')
  onProjectLeave(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('onProjectLeave');
    client.leave(`project-${data.projectId}`);
    console.log(client.rooms);
  }

  @SubscribeMessage('onCodeUpdate')
  handleCodeUpdate(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.to(`project-${data.projectId}`).emit('onCodeUpdate', data);
  }

  @OnEvent(Events.OnJobDone)
  handleJobDone(payload: JobPayload) {
    const { job, user } = payload;

    if (job.project.isPublic) {
      const projectId = job.project.id;

      return this.server
        .to(`project-${projectId}`)
        .emit('onJobDone', { ...job, project: undefined });
    }

    const userSocket = this.sessionManager.getUserSocket(user.id);
    if (userSocket)
      userSocket.emit('onJobDone', { ...job, project: undefined });
  }

  @OnEvent(Events.OnJobCreate)
  handleJobCreate(job: Job) {
    const projectId = job.project.id;
    this.server
      .to(`project-${projectId}`)
      .emit('onJobCreate', { ...job, project: undefined });
  }

  @OnEvent(Events.OnProjectUpdate)
  handleOnProjectUpdate(user: User, project: Project) {
    const projectId = project.id;

    const client = this.sessionManager.getUserSocket(user.id);

    client &&
      client.to(`project-${projectId}`).emit('onProjectUpdate', project);
  }
}
