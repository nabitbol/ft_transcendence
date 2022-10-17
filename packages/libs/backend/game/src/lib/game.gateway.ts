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
import { Lobby } from './lobby'
 
import { jwtConstants } from "@ft-transcendence/libs-backend-auth";
 
import { UserService } from '@ft-transcendence/libs-backend-user';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require("jsonwebtoken");

@WebSocketGateway(3030, {cors: {origin: 'http://localhost:4200'}})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly lobbyManager: LobbyManager,
    private readonly userService: UserService
  )
  {
  }
  
  afterInit(server: Server): void
  {
    this.lobbyManager.server = server;
  }

  async handleConnection(client: Socket): Promise<void>
  {
    try {
      const bearerToken = client.handshake.headers.authorization.split(" ")[1];
      const decoded = await jwt.verify(bearerToken, jwtConstants.secret);
      const user = await this.userService.getUserByName(decoded.name);
      if (!user)
      {
        client.disconnect();
        this.lobbyManager.terminateSocket(client);
      }
      client.data.user = user;
      console.log("User: " + user.name + " join the game");
    } catch (err) {
        client.disconnect();
        this.lobbyManager.terminateSocket(client);
    }
    this.lobbyManager.initializeSocket(client);
  }

  async handleDisconnect(client: Socket): Promise<void>
  {
    console.log("User: " + client.data.user.name + " left the game");
    this.lobbyManager.terminateSocket(client);
  }

  @SubscribeMessage(ClientEvents.EnterMatchMaking)
  onEnterMatchmaking(client: Socket, mode: 'simple' | 'double')
  {
    this.lobbyManager.enterMatchMaking(client, mode);
  }

  @SubscribeMessage(ClientEvents.GameInput)
  oninput(client: Socket, data): void
  {
    this.lobbyManager.gameInput(client, data);
  }

  @SubscribeMessage(ClientEvents.CreateRoom)
  onLobbyCreate(client: Socket, mode: 'simple' | 'double'): WsResponse<ServerPayloads[ServerEvents.LobbyCreated]>
  {
    this.lobbyManager.createLobby(client, mode);
    return {
      event: ServerEvents.LobbyCreated,
      data: {
        message: 'Room created',
        lobbyId: client.data.lobby?.getId(),
      },
    };
  }

  @SubscribeMessage(ClientEvents.JoinRoom)
  onLobbyJoin(client: Socket, data): WsResponse<ServerPayloads[ServerEvents.LobbyJoined]>
  {
    this.lobbyManager.joinLobby(data.lobbyId, client);
    return {
      event:ServerEvents.LobbyJoined,
      data: {
        message: 'Successfully joined',
      },
    };
  }

  @SubscribeMessage(ClientEvents.JoinRoom)
  onSpectate(client: Socket, data): WsResponse<ServerPayloads[ServerEvents.LobbyJoined]>
  {
    this.lobbyManager.spectateLobby(data.lobbyId, client);
    return {
      event:ServerEvents.LobbyJoined,
      data: {
        message: 'Successfully joined',
      },
    };
  }

  @SubscribeMessage(ClientEvents.LobbyList)
  onLobbyList(client: Socket): WsResponse<ServerPayloads[ServerEvents.LobbyList]>
  {
    const lobbies: Map<Lobby['id'], Lobby> = this.lobbyManager.getLobbies(client);
    return {
      event:ServerEvents.LobbyList,
      data: {
        lobbies
      },
    };
  }

  @SubscribeMessage(ClientEvents.LeaveRoom)
  onLobbyLeave(client: Socket): void
  {
    this.lobbyManager.terminateSocket(client);
  }
}