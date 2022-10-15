import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { GameInstance } from './game.instance';
import { ServerEvents, ServerPayloads } from "@ft-transcendence/libs-shared-types"


export class Lobby
{
  private id: string = v4();

  public readonly createdAt: Date = new Date();

  private clients: Map<Socket['id'], Socket> = new Map<Socket['id'], Socket>();

  private gameInstance: GameInstance = new GameInstance(this);

  constructor( private server: Server)
  {
  }

  public addClient(client: Socket): void
  {
    console.log("Add client to lobby");
    this.clients.set(client.id, client);
    console.log("Client " + client.id +" join: " + this.id);
    client.join(this.id);
    client.data.lobby = this;

    if (this.clients.size >= 2) {
      this.gameInstance.startGame();
    }
  }

  public removeClient(client: Socket): void
  {
    console.log("Removed client from lobby");
    this.clients.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;
  }

  public sendGameInfo(): void
  {
    const payload: ServerPayloads[ServerEvents.GameInfo] = {
     info: this.gameInstance.getGameInfo(),
    };
    this.sendMessage(ServerEvents.GameInfo, payload);
  }

  public sendMessage<T>(event: ServerEvents, payload: T): void
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
}