import { Test, TestingModule } from '@nestjs/testing';
import { ActionsLogController } from '../actions-log.controller';

describe('ActionsLogController', () => {
  let controller: ActionsLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionsLogController],
    }).compile();

    controller = module.get<ActionsLogController>(ActionsLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
