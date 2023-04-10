import { Module } from '@nestjs/common';
import { Pdf2imgService } from './pdf2img.service';
import { Pdf2imgGateway } from './pdf2img.gateway';
import { PlaywrightModule } from 'nestjs-playwright';

@Module({
  providers: [Pdf2imgGateway, Pdf2imgService],
  imports: [PlaywrightModule.forFeature()],
})
export class Pdf2imgModule {}
