import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDTo } from './dtos/new-mwssage.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';


@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtServices: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtServices.verify(token);
      
      await this.messageWsService.registerClient(client, payload.id);

    } catch (error) {
      client.disconnect();
      return;
    }
    //console.log({payload});
  
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients())
    //console.log({ conectados: this.messageWsService.getConnectedClients()});
  }

  handleDisconnect(client: any) {
    this.messageWsService.removeClient( client.id );
    //console.log({ conectados: this.messageWsService.getConnectedClients()});
  }

  // message-from-client
  @SubscribeMessage('message-from-client')
  onMessageFromClient( client: Socket, payload: NewMessageDTo ) {
    
    //! Emite unicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message'
    // });
    //! Emitir a todos Menos al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message'
    // });
    //! Emitir a todos incluso el cliente que manda
    this.wss.emit('message-from-server', {
        fullName: this.messageWsService.getUserFullNameBySocketId(client.id),
        message: payload.message || 'no-message'
    });

  }


  
  

}
