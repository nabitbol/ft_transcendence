import { Socket, Server } from 'socket.io';
import { Cron } from '@nestjs/schedule';
import { Lobby } from './lobby'
import { ServerEvents, ServerPayloads } from "@ft-transcendence/libs-shared-types"

export class LobbyManager
{
  public server: Server;

  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<Lobby['id'], Lobby>();

  public initializeSocket(client: Socket): void
  {
    client.data.lobby = null;
  }

  public getRandomLobbyId(): string
  {
    return this.lobbies.keys().next().value;
  }

  public enterMatchMaking(client: Socket): void
  {
    console.log("Enter matchMaking !");
    console.log("There is currently: " + this.lobbies.size + ' lobbies');
    if (this.lobbies.size <= 0) {
      this.createLobby(client);
    }
    else {
      console.log(this.getRandomLobbyId());
      this.joinLobby(this.getRandomLobbyId(), client);
    }
  }
  
  public terminateSocket(client: Socket): void
  {
    client.data.lobby?.removeClient(client)
  }

  public createLobby(client: Socket): void
  {
    console.log("Create new lobby");
    const lobby = new Lobby(this.server);
    this.lobbies.set(lobby.getId(), lobby);
    lobby.addClient(client);
  }

  public joinLobby(lobbyId: string, client: Socket): void
  {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      throw new Error('Lobby not found');
      }
    
    if (lobby.getClients().size >= 2) {
      throw new Error('Lobby already full');
      }
      
    lobby.addClient(client);
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
        lobby.sendMessage<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
          message: 'Game timed out',
        });

        lobby.getGameInstance().endGame();
0
        this.deleteLobby(lobby.getId());
      }
    }
  }
}

