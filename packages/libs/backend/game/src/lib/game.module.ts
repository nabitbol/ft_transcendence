 
import { MatchModule } from '@ft-transcendence/libs-backend-match';
import { UserModule } from '@ft-transcendence/libs-backend-user';
import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameInstance } from './game.instance';
import { Lobby } from './lobby';
import { LobbyManager } from './lobby.manager';

@Module({
	imports: [UserModule, MatchModule],
	providers: [GameGateway, LobbyManager, GameInstance, Lobby],
})
export class GameModule {}
