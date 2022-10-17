import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { GameInstance } from './game.instance';
import { PlayersName, ServerEvents, ServerPayloads } from "@ft-transcendence/libs-shared-types"

export class Lobby
{
  private id: string = v4();

  public readonly createdAt: Date = new Date();

  private clients: Map<Socket['id'], Socket> = new Map<Socket['id'], Socket>();

  private clients_spectator: Map<Socket['id'], Socket> = new Map<Socket['id'], Socket>();

  private players_name: PlayersName;
  private gameInstance: GameInstance;

  constructor( private server: Server, private mode: 'simple' | 'double')
  {
    this.gameInstance = new GameInstance(this, this.mode); 
    this.gameInstance = new GameInstance(this, this.mode); 
  }

  public addClient(client: Socket): void
  {
    console.log("Add client to lobby");
    this.clients.set(client.id, client);
    console.log("Client " + client.id +" join: " + this.id);
    client.join(this.id);
    client.data.lobby = this;


    if(!this.players_name.left)
      this.players_name.left = client.data.user.name;
    else
      this.players_name.right = client.data.user.name;
    if (this.clients.size >= 2) {
      this.gameInstance.startGame(this.players_name);
    }
  }

  public addSpectator(client: Socket): void
  {
    console.log("Add spectator to lobby");
    this.clients_spectator.set(client.id, client);
    console.log("Client " + client.id +" join: " + this.id);
    client.join(this.id);
  }

  public removeClient(): void
  {
    this.gameInstance.endGame();

    for (const [clientId, client] of this.clients) {
        console.log("Removed client from lobby");
        this.clients.delete(client.id);
        client.leave(this.id);
        client.data.lobby = null;
      }
      if (this.gameInstance.getGameInfo().has_started) {
        this.gameInstance.resetGame();
      }
  }

  public sendGameInfo(): void
  {
    const payload: ServerPayloads[ServerEvents.GameInfo] = {
     info: this.gameInstance.getGameInfo(),
    };
    this.sendVolatileMessage(ServerEvents.GameInfo, payload);
  }

  public sendMessage<T>(event: ServerEvents, payload: T): void
  {
    this.server.to(this.id).emit(event, payload);
  }

  public sendVolatileMessage<T>(event: ServerEvents, payload: T): void
  {
    this.server.volatile.to(this.id).emit(event, payload);
  }

  public getId() : string
  {
    return this.id;
  }

  public getClients() : Map<Socket['id'], Socket>
  {
    return this.clients;
  }

  public getGameInstance() : GameInstance
  {
    return this.gameInstance;
  }

  public getMode() : 'simple' | 'double'
  {
    return this.mode;
  }
}