import { Test } from '@nestjs/testing';
import { MatchService } from './match.service';

describe('MatchService', () => {
  let service: MatchService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MatchService]
    }).compile();

    service = module.get(MatchService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
})
