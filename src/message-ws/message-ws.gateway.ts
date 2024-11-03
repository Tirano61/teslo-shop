import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageWsService: MessageWsService
  ) {}

  handleDisconnect(client: any) {
    console.log( 'Client disconnect', client.id );
  }
  
  handleConnection( client: Socket ) {
    console.log( 'Client connected', client.id );
    
  }


}
