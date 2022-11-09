import { Socket, Server } from 'socket.io';
import { Cron } from '@nestjs/schedule';
import { Lobby } from './lobby'
import { WsException } from '@nestjs/websockets'
 
import { ServerEvents, ServerPayloads } from "@ft-transcendence/libs-shared-types"

export class LobbyManager
{
  public server: Server;

  private readonly all_clients: Map<string, Socket> = new Map<string, Socket>();

  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<Lobby['id'], Lobby>();

  public initializeSocket(client: Socket): void
  {
    client.data.lobby = null;
    if(client.data.user)
    {
      this.all_clients.set(client.data.user.name, client);
    }
  }

  public getClient(name: string): Socket
  {
    return this.all_clients.get(name);
  }

  public isInRoom(client_name: string): boolean
  {
    let clients: Map<Socket['id'], Socket>;
    for (const [lobbyId, lobby] of this.lobbies) {
      clients = lobby.getClients();
      for (const [clientId, client] of clients) {
        if(client.data.user.name === client_name)
          return (true);
      }
    }
    return (false);
  }

  public playerList(): Array<string>
  {
    const players: Array<string> = new Array<string>;
    let clients: Map<Socket['id'], Socket>;
    for (const [lobbyId, lobby] of this.lobbies) {
      clients = lobby.getClients();
      for (const [clientId, client] of clients) {
        players.push(client.data.user.name);
      }
    }
    return (players);
  }

  public getRandomPublicLobbyId(mode): string
  {
    return this.getRandomPublicLobby(mode).getId();
  }

  public gameInput(client: Socket, data) : void
  {
    client.data.lobby?.getGameInstance().inputGame(client, data);
  }

  public getRandomPublicLobby(mode: 'simple' | 'double') : Lobby | undefined
  {
    for (const [lobbyId, lobby] of this.lobbies) {
      if(lobby.getMode() ===  mode && lobby.getClients().size < 2 && lobby.getStatus() === "public")
        return lobby;
    }
    return undefined;
  }

  public enterMatchMaking(client: Socket, mode: 'simple' | 'double'): void
  {
    if (this.getRandomPublicLobby(mode) === undefined) {
      this.createPublicLobby(client, mode);
    }
    else {
      this.joinLobby(this.getRandomPublicLobbyId(mode), client);
    }
  }
  
  public terminateSocket(client: Socket): void
  {
    client.data.lobby?.removeClient(client);
    if(client.data.user)
    {
      this.all_clients.delete(client.data.user.name);
    }
  }

  public createPrivateLobby(client: Socket, to_invite: string)
  {
    const lobby = new Lobby(this.server, 'simple');
    lobby.setStatus("private");
    lobby.addClient(client);
    this.lobbies.set(lobby.getId(), lobby);

    const lobby_id: string = lobby.getId();
    const client_to_invite: Socket = this.getClient(to_invite);
    if(!client_to_invite || !client_to_invite.data)
      throw new WsException('This person is not online !');
    this.server.to(client_to_invite.id).emit('server.lobbyinvite', lobby_id);
  }

  public createPublicLobby(client: Socket, data: 'simple' | 'double'): void
  {
    const lobby = new Lobby(this.server, data);
    lobby.setStatus("public");
    lobby.addClient(client);
    this.lobbies.set(lobby.getId(), lobby);
  }

  public joinLobby(lobbyId: string, client: Socket): void
  {

    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      throw new WsException('Lobby not found');
      }
    
    if (lobby.getClients().size >= 2) {
      throw new WsException('Lobby already full');
      }
      
    lobby.addClient(client);
  }

  public spectateLobby(lobbyId: string, client: Socket): void
  {
    client.join(lobbyId);
  }

  public deleteLobby(lobbyId: string): void
  {
    this.lobbies.delete(lobbyId);
  }

  @Cron('*/5 * * * *')
  private lobbiesCleaner(): void
  {
    for (const [lobbyId, lobby] of this.lobbies) {
      const now = (new Date()).getTime();
      const lobbyCreatedAt = lobby.createdAt.getTime();
      const lobbyLifetime = now - lobbyCreatedAt;

      if (lobbyLifetime > 3_600_000) {
        lobby.getGameInstance().sendMessage<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
          message: 'Game timed out',
        });

        lobby.getGameInstance().getGameData().has_ended = true;
0
        this.deleteLobby(lobby.getId());
      }
    }
  }

  public getLobbies(): Map<Lobby['id'], Lobby>
  {
    return this.lobbies;
  }
}

