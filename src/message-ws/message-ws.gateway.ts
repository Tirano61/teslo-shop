import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { PartialType } from '@nestjs/swagger';
import { NewMessageDTo } from './dtos/new-mwssage.dto';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server

  constructor(
    private readonly messageWsService: MessageWsService
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication;
    console.log({token});
    this.messageWsService.registerClient( client );
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
        fullName: 'Soy yo',
        message: payload.message || 'no-message'
    });

  }
  
  

}
