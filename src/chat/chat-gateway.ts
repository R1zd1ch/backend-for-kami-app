import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway(3005, {})
export class ChatGateway {
  @SubscribeMessage('newMessage')
  handleNewMessage(@MessageBody() message: any) {
    console.log(message);
  }
}
