import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConectedClients {
    [id: string]: Socket,
}

@Injectable()
export class MessageWsService {

    private connectClients: ConectedClients = {}

    registerClient(client: Socket){
        this.connectClients[client.id] = client;
    }

    removeClient( clientId: string){
        delete this.connectClients[clientId];
    }

    getConnectedClients(): string[]{
        return Object.keys(this.connectClients);
    }
}
