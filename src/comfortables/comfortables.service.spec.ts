import { Test, TestingModule } from '@nestjs/testing';
import { ComfortablesService } from './comfortables.service';

describe('ComfortablesService', () => {
  let service: ComfortablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComfortablesService],
    }).compile();

    service = module.get<ComfortablesService>(ComfortablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
