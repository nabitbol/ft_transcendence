import { Socket, Server } from 'socket.io';
import { Cron } from '@nestjs/schedule';
import { Lobby } from './lobby'
import { WsException } from '@nestjs/websockets'
 
import { ServerEvents, ServerPayloads } from "@ft-transcendence/libs-shared-types"

export class LobbyManager
{
  public server: Server;

  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<Lobby['id'], Lobby>();

  public initializeSocket(client: Socket): void
  {
    client.data.lobby = null;
  }

  public isInRoom(client_name: string): boolean
  {
    let clients: Map<Socket['id'], Socket>;;
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
        console.log("CHARLI" + client.data.user.name);
        players.push(client.data.user.name);
      }
    }
    return (players);
  }

  public getRandomLobbyId(mode): string
  {
    return this.getRandomLobby(mode).getId();
  }

  public gameInput(client: Socket, data) : void
  {
    client.data.lobby?.getGameInstance().inputGame(client, data);
  }

  public getRandomLobby(mode: 'simple' | 'double') : Lobby | undefined
  {
    for (const [lobbyId, lobby] of this.lobbies) {
      if(lobby.getMode() ===  mode && lobby.getClients().size < 2)
        return lobby;
    }
    return undefined;
  }

  public enterMatchMaking(client: Socket, mode: 'simple' | 'double'): void
  {
    console.log("Enter matchMaking !");
    if (this.getRandomLobby(mode) === undefined) {
      this.createLobby(client, mode);
    }
    else {
      this.joinLobby(this.getRandomLobbyId(mode), client);
    }
  }
  
  public terminateSocket(client: Socket): void
  {
    client.data.lobby?.removeClient(client);
  }

  public createLobby(client: Socket, data: 'simple' | 'double'): void
  {
    console.log("Create new lobby: " + data);
    const lobby = new Lobby(this.server, data);
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
    console.log("Spectate lobby: " + lobbyId);
    client.join(lobbyId);
  }

  public deleteLobby(lobbyId: string): void
  {
    this.lobbies.delete(lobbyId);
  }

  @Cron('*/5 * * * *')
  private lobbiesCleaner(): void
  {
    console.log("Cleanup lobby");
    for (const [lobbyId, lobby] of this.lobbies) {
      const now = (new Date()).getTime();
      const lobbyCreatedAt = lobby.createdAt.getTime();
      const lobbyLifetime = now - lobbyCreatedAt;

      if (lobbyLifetime > 3_600_000) {
        lobby.getGameInstance().sendMessage<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
          message: 'Game timed out',
        });

        lobby.getGameInstance().getGameInfo().has_ended = true;
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

