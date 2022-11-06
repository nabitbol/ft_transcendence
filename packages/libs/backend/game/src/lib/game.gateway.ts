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
    if(!client || client === undefined)
      return;
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
    } catch (err) {
        client.disconnect();
        this.lobbyManager.terminateSocket(client);
    }
    this.lobbyManager.initializeSocket(client);
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
    console.log("Accept invitation to lobby:" + lobbyId);
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
    console.log("Cancel invitation to lobby:" + lobbyId);
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
    console.log(players);
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
    console.log(client.data.user.name + " want so spectate");
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
      if(lobby.getGameInstance().getGameInfo().has_ended === false &&
      lobby.getGameInstance().getGameInfo().has_started === true)
      lobbiesInfo.push({left: lobby.getGameInstance().getGameInfo().players_name.left, 
        right:lobby.getGameInstance().getGameInfo().players_name.right
        , game_mode: lobby.getMode(), id: lobby.getId()})
    }
    console.log(lobbiesInfo);
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
    this.lobbyManager.terminateSocket(client);
  }
}