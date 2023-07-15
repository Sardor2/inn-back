import { Test, TestingModule } from '@nestjs/testing';
import { ComfortablesController } from './comfortables.controller';
import { ComfortablesService } from './comfortables.service';

describe('ComfortablesController', () => {
  let controller: ComfortablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComfortablesController],
      providers: [ComfortablesService],
    }).compile();

    controller = module.get<ComfortablesController>(ComfortablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
