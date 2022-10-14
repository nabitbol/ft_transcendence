import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { ClientEvents, ServerEvents, ServerPayloads } from "@ft-transcendence/libs-shared-types"
import { Socket, Server} from 'socket.io';
import { LobbyManager } from './lobby.manager'

@WebSocketGateway(3030, {cors: {origin: 'http://localhost:4200'}})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly lobbyManager: LobbyManager,
  )
  {
  }
  
  afterInit(server: Server): void
  {
    console.log("Init server");
    this.lobbyManager.server = server;
  }

  async handleConnection(client: Socket): Promise<void>
  {
    console.log("New client connected");
    this.lobbyManager.initializeSocket(client);
  }

  async handleDisconnect(client: Socket): Promise<void>
  {
    console.log("A client disconnected");
    this.lobbyManager.terminateSocket(client);
  }


  @SubscribeMessage(ClientEvents.CreateRoom)
  onLobbyCreate(client: Socket): WsResponse<ServerPayloads[ServerEvents.GameMessage]>
  {
    this.lobbyManager.createLobby(client);
    return {
      event: ServerEvents.GameMessage,
      data: {
        message: 'Room created',
      },
    };
  }

  @SubscribeMessage(ClientEvents.JoinRoom)
  onLobbyJoin(client: Socket, data): WsResponse<ServerPayloads[ServerEvents.GameMessage]>
  {
    this.lobbyManager.joinLobby(data.lobbyId, client);
    
    return {
      event:ServerEvents.GameMessage,
      data: {
        message: 'Successfully joined',
      },
    };
  }

  @SubscribeMessage(ClientEvents.LeaveRoom)
  onLobbyLeave(client: Socket): void
  {
    client.data.lobby?.removeClient(client);
  }
}