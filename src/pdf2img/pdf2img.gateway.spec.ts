import { Test, TestingModule } from '@nestjs/testing';
import { Pdf2imgGateway } from './pdf2img.gateway';
import { Pdf2imgService } from './pdf2img.service';

describe('Pdf2imgGateway', () => {
  let gateway: Pdf2imgGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Pdf2imgGateway, Pdf2imgService],
    }).compile();

    gateway = module.get<Pdf2imgGateway>(Pdf2imgGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
