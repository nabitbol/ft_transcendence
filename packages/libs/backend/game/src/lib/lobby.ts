import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { GameInstance } from './game.instance';
import { PlayersName } from "@ft-transcendence/libs-shared-types"

export class Lobby
{
  private id: string = v4();

  private status: 'public' | 'private';

  public readonly createdAt: Date = new Date();

  private clients: Map<Socket['id'], Socket> = new Map<Socket['id'], Socket>();

  private clients_spectator: Map<Socket['id'], Socket> = new Map<Socket['id'], Socket>();

  private players_name: PlayersName = {left: undefined, right: undefined};
  
  private gameInstance: GameInstance;

  constructor( private server: Server, private mode: 'simple' | 'double')
  {
    this.gameInstance = new GameInstance(this.mode, this.id, this.server); 
  }

  public addClient(client: Socket): void
  {
    console.log("Client " + client.id +" join: " + this.id);
    this.clients.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;
    
    
    if(!this.players_name.left)
      this.players_name.left = client.data.user.name;
    else
      this.players_name.right = client.data.user.name;
    console.log(this.players_name);
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

  public async removeClient(client: Socket): Promise<void>
  {
    this.players_name = {left: undefined, right: undefined};
    this.gameInstance.setLostPlayer(client.data.user.name);
    this.gameInstance.endGame();
    await this.gameInstance.delay(2000);
    for (const [clientId, client] of this.clients) {
        console.log("Removed client from lobby");
        this.clients.delete(client.id);
        client.leave(this.id);
        client.data.lobby = null;
      }
      if (this.gameInstance.getGameData().has_started) {
        this.gameInstance.resetGame();
      }
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

  public getStatus() : 'public' | 'private'
  {
    return this.status;
  }

  public setStatus(new_status: 'public' | 'private')
  {
    this.status = new_status;
  }
}