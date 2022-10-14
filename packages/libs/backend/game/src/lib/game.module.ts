import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameInstance } from './game.instance';
import { Lobby } from './lobby';
import { LobbyManager } from './lobby.manager';

@Module({
	providers: [GameGateway, LobbyManager, GameInstance, Lobby],
})
export class GameModule {}
