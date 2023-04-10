import { Module } from '@nestjs/common';
import { Pdf2imgService } from './pdf2img.service';
import { Pdf2imgGateway } from './pdf2img.gateway';

@Module({
  providers: [Pdf2imgGateway, Pdf2imgService],
})
export class Pdf2imgModule {}