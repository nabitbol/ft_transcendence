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
    this.lobbyManager.server = server;
  }

  async handleConnection(client: Socket): Promise<void>
  {
    this.lobbyManager.initializeSocket(client);
  }

  async handleDisconnect(client: Socket): Promise<void>
  {
    this.lobbyManager.terminateSocket(client);
  }

  @SubscribeMessage(ClientEvents.EnterMatchMaking)
  onEnterMatchmaking(client: Socket, mode: 'simple' | 'double')
  {
    console.log(mode);
    this.lobbyManager.enterMatchMaking(client, mode);
  }

  @SubscribeMessage(ClientEvents.GameInput)
  oninput(client: Socket, data): void
  {
    this.lobbyManager.gameInput(client, data);
  }

  @SubscribeMessage(ClientEvents.CreateRoom)
  onLobbyCreate(client: Socket, mode: 'simple' | 'double'): WsResponse<ServerPayloads[ServerEvents.lobbyCreated]>
  {
    this.lobbyManager.createLobby(client, mode);
    return {
      event: ServerEvents.lobbyCreated,
      data: {
        message: 'Room created',
        lobbyId: client.data.lobby?.getId(),
      },
    };
  }

  @SubscribeMessage(ClientEvents.JoinRoom)
  onLobbyJoin(client: Socket, data): WsResponse<ServerPayloads[ServerEvents.GameMessage]>
  {
    this.lobbyManager.joinLobby(data.lobbyId, client);
    return {
      event:ServerEvents.LobbyJoined,
      data: {
        message: 'Successfully joined',
      },
    };
  }

  @SubscribeMessage(ClientEvents.LeaveRoom)
  onLobbyLeave(client: Socket): void
  {
    this.lobbyManager.terminateSocket(client);
  }
}