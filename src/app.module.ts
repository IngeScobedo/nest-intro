import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';
import { BrandsModule } from './brands/brands.module';
import { SeedModule } from './seed/seed.module';
import { Pdf2imgModule } from './pdf2img/pdf2img.module';
import { PlaywrightModule } from 'nestjs-playwright';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CarsModule,
    BrandsModule,
    SeedModule,
    Pdf2imgModule,
    PlaywrightModule.forRoot({
      headless: true,
      channel: 'chromium',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
