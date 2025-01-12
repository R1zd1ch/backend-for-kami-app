import { Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3002, {
  cors: {
    origin: '*',
  },
})
@Injectable()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('NotificationsGateway');
  private clients: Map<string, Socket> = new Map(); // Map userId -> socket

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.clients.set(userId, client);
      this.logger.log(`Client connected: ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = Array.from(this.clients.entries()).find(
      ([, socket]) => socket === client,
    )?.[0];
    if (userId) {
      this.clients.delete(userId);
      this.logger.log(`Client disconnected: ${userId}`);
    }
  }

  sendNotification(userId: string, message) {
    const client = this.clients.get(userId);
    if (client) {
      client.emit('notification', { message });
    } else {
      this.logger.warn(`User ${userId} is not connected.`);
    }
  }
}
