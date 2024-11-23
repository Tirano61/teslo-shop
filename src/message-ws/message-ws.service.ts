import { Injectable } from '@nestjs/common';
import { User } from "./../auth/entities/user.entity";
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';

interface ConectedClients {
    [id: string]: {
        socket: Socket,
        user: User
    },

}

@Injectable()
export class MessageWsService {

    private connectClients: ConectedClients = {}

    constructor(
        @InjectRepository( User )
        private readonly userRepository: Repository<User>,
    ){}

    async registerClient(client: Socket, userId: string) {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) throw new Error(' User not found');
        if (!user.isActive) throw new Error(' User not active');

        this.checkUserConnection(user);
            
        this.connectClients[client.id] = {
            socket: client,
            user: user
        };
    }

    removeClient( clientId: string){
        delete this.connectClients[clientId];
    }

    getConnectedClients(): string[]{
        return Object.keys(this.connectClients);
    }

    getUserFullNameBySocketId(socketId: string) {
        return this.connectClients[socketId].user.fullName;
    }

    private checkUserConnection( user: User) {
        for (const clientId of Object.keys(this.connectClients)){
            const connectedClient = this.connectClients[clientId]
            if (connectedClient.user.id === user.id) {
                connectedClient.socket.disconnect();
                break;
            }
        }
    }
}
