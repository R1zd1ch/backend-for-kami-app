import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class NotificationsService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  notify(userId: string, payload: any) {
    if (this.server) {
      this.server.to(userId).emit('notification', payload);
    }
  }
}
