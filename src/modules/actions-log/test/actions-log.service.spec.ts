import { Test, TestingModule } from '@nestjs/testing';
import { ActionsLogService } from '../actions-log.service';

describe('ActionsLogService', () => {
  let service: ActionsLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionsLogService],
    }).compile();

    service = module.get<ActionsLogService>(ActionsLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
