import { Test } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

describe('MatchController', () => {
	let controller: MatchController;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [MatchService],
			controllers: [MatchController]
		}).compile();

		controller = module.get(MatchController);
	});

	it('should be defined', () => {
		expect(controller).toBeTruthy();
	});
})
