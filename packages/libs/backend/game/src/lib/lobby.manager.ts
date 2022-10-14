import { Socket, Server } from 'socket.io';
import { Cron } from '@nestjs/schedule';
import { Lobby } from './lobby';

export class LobbyManager
{
  private server: Server;

  private lobbies: Map<Lobby['id'], Lobby> = new Map<Lobby['id'], Lobby>();

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
    this.lobbies.set(lobby.id, lobby);
    lobby.addClient(client);
  }

  public joinLobby(lobbyId: string, client: Socket): void
  {
    const lobby = this.lobbies.get(lobbyId);

    if (!lobby) {
      throw new Error('Lobby not found');
      }
    
    if (lobby.clients.size >= 2) {
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

      if (lobbyLifetime > LOBBY_MAX_LIFETIME) {
        lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
          color: 'blue',
          message: 'Game timed out',
        });

        lobby.instance.triggerFinish();

        this.lobbies.delete(lobby.id);
      }
    }
  }
}

