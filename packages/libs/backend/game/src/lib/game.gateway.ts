import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsException,
} from '@nestjs/websockets';
 
import { ClientEvents, ServerEvents, ServerPayloads, SpectateInfo } from "@ft-transcendence/libs-shared-types"
import { Socket, Server} from 'socket.io';
import { LobbyManager } from './lobby.manager'
import { Lobby } from './lobby'
import { jwtConstants } from "@ft-transcendence/libs-backend-auth";
import { UserService } from '@ft-transcendence/libs-backend-user';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require("jsonwebtoken");

@WebSocketGateway(+process.env.NX_SOCKET_GAME, {cors: {origin: `http://${process.env.NX_HOST_NAME}:${process.env.NX_FRONTEND_PORT}`}})
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

  async handleConnection(client: Socket)
  {
    if(!client || client === undefined)
      return;
    try {
      const bearerToken = client.handshake.headers.authorization.split(" ")[1];
      if (bearerToken === undefined)
      {
        client.disconnect();
        return;
      }
      const decoded = await jwt.verify(bearerToken, jwtConstants.secret);
      const user = await this.userService.getUserByName(decoded.name);
      if (!user || user === undefined)
      {
        client.disconnect();
        return;
      }
      client.data.user = user;
      if(this.lobbyManager.getClient(user.name)) // On new connection: delete old client and send him event
      {
        const old_client: Socket = this.lobbyManager.getClient(user.name)
        this.lobbyManager.server.to(old_client.id).emit(ServerEvents.DoubleLog);
        this.lobbyManager.terminateSocket(old_client);
        old_client.disconnect();
      }
      this.lobbyManager.initializeSocket(client);
    } catch (err) {
        this.lobbyManager.terminateSocket(client);
        client.disconnect();
        return;
    }
  }

  async handleDisconnect(client: Socket): Promise<void>
  {
    if(!client || client === undefined)
      return;
    this.lobbyManager.terminateSocket(client);
  }

  @SubscribeMessage(ClientEvents.EnterMatchMaking)
  onEnterMatchmaking(client: Socket, mode: 'simple' | 'double')
  {
    if(!client || client === undefined)
      return;
    if(this.lobbyManager.isInRoom(client.data.user.name))
      throw new WsException('You are already in a lobby !');
    this.lobbyManager.enterMatchMaking(client, mode);
  }

  @SubscribeMessage(ClientEvents.GameInput)
  oninput(client: Socket, data): void
  {
    if(!client || client === undefined)
      return;
    this.lobbyManager.gameInput(client, data);
  }

  @SubscribeMessage(ClientEvents.CreateRoom)
  onLobbyCreate(client: Socket, mode: 'simple' | 'double'): WsResponse<ServerPayloads[ServerEvents.LobbyCreated]>
  {
    if(!client || client === undefined)
      return;
    if(this.lobbyManager.isInRoom(client.data.user.name))
      throw new WsException('You are already in a lobby !');
    this.lobbyManager.createPublicLobby(client, mode);
    return {
      event: ServerEvents.LobbyCreated,
      data: {
        message: 'Room created',
        lobbyId: client.data.lobby?.getId(),
      },
    };
  }

  @SubscribeMessage(ClientEvents.AcceptInvite)
  onAcceptInvitation(client: Socket, lobbyId): WsResponse<ServerPayloads[ServerEvents.LobbyJoined]>
  {
    if(!client || client === undefined)
      return;
    if(this.lobbyManager.isInRoom(client.data.user.name))
      throw new WsException('You are already in a lobby !');
    this.lobbyManager.joinLobby(lobbyId, client);
    return {
      event:ServerEvents.LobbyJoined,
      data: {
        message: 'Successfully joined',
      },
    };
  }

  @SubscribeMessage(ClientEvents.CancelInvite)
  onCancelInvitation(client: Socket, lobbyId)
  {
    if(!client || client === undefined)
      return;
    this.lobbyManager.deleteLobby(lobbyId);
  }

  @SubscribeMessage(ClientEvents.LobbyInvite)
  onLobbyInvitation(client: Socket, to_invite: string)
  {
    if(!client || client === undefined)
      return;
    if(this.lobbyManager.isInRoom(client.data.user.name))
      throw new WsException('You are already in a lobby !');
    if(this.lobbyManager.isInRoom(to_invite))
      throw new WsException('This person is already playing !');
    this.lobbyManager.createPrivateLobby(client, to_invite);
  }

  @SubscribeMessage(ClientEvents.PlayerList)
  onPlayerList(client: Socket): WsResponse<ServerPayloads[ServerEvents.PlayerList]>
  {
    if(!client || client === undefined)
      return;
    const players: Array<string> = this.lobbyManager.playerList();
    return {
      event:ServerEvents.PlayerList,
      data: {
        players,
      },
    };
  }

  @SubscribeMessage(ClientEvents.SpectateGame)
  onSpectate(client: Socket, lobbyId)
  {
    if(!client || client === undefined)
      return;
    this.lobbyManager.spectateLobby(lobbyId, client);
  }

  @SubscribeMessage(ClientEvents.LobbyList)
  onLobbyList(client: Socket): WsResponse<ServerPayloads[ServerEvents.LobbyList]>
  {
    if(!client || client === undefined)
      return;
    if(this.lobbyManager.isInRoom(client.data.user.name))
      throw new WsException('You are already in a game !');
    const lobbies: Map<Lobby['id'], Lobby> = this.lobbyManager.getLobbies();
    const lobbiesInfo: Array<SpectateInfo> = new Array<SpectateInfo>;
    for (const [lobbyId, lobby] of lobbies) {
      if(lobby.getGameInstance().getGameData().has_ended === false &&
      lobby.getGameInstance().getGameData().has_started === true)
      lobbiesInfo.push({left: lobby.getGameInstance().getGameData().players_name.left, 
        right:lobby.getGameInstance().getGameData().players_name.right
        , game_mode: lobby.getMode(), id: lobby.getId()})
    }
    return {
      event:ServerEvents.LobbyList,
      data: {
        lobbies: lobbiesInfo
      },
    };
  }

  @SubscribeMessage(ClientEvents.LeaveRoom)
  onLobbyLeave(client: Socket): void
  {
    if(!client || client === undefined)
      return;
    client.data.lobby?.removeClient(client);
  }
}
