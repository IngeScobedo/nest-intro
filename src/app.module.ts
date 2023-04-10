import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';
import { BrandsModule } from './brands/brands.module';
import { SeedModule } from './seed/seed.module';
import { Pdf2imgModule } from './pdf2img/pdf2img.module';

@Module({
  imports: [CarsModule, BrandsModule, SeedModule, Pdf2imgModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
