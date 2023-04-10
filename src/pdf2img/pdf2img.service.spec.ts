import { Test, TestingModule } from '@nestjs/testing';
import { Pdf2imgService } from './pdf2img.service';

describe('Pdf2imgService', () => {
  let service: Pdf2imgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Pdf2imgService],
    }).compile();

    service = module.get<Pdf2imgService>(Pdf2imgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
