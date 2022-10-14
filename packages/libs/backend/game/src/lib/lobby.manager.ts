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

  public terminateSocket(client: Socket): void
  {
    client.data.lobby?.removeClient(client)
  }

  public createLobby(client: Socket): void
  {
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

  @Cron('*/5 * * * *')
  private lobbiesCleaner(): void
  {
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
        this.lobbies.delete(lobby.getId());
      }
    }
  }
}

