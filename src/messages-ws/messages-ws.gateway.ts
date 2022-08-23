import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer,
          SubscribeMessage } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtPayload } from 'src/auth/interfaces';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server
  
  constructor(
      private readonly messagesWsService: MessagesWsService,
      private readonly jwtSrv: JwtService
    ) { }

 
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtSrv.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);

    } catch(error) {
      client.disconnect();
      return ;
    }    
    
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   payload: payload.message || 'no-message'
    // });

    // Emitir a todos excepto el cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   payload: payload.message || 'no-message'
    // });

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message'
    });
  }

}
